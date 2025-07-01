import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@user/entity/user.entity';
import { Model } from 'mongoose';
import { CreatedUserDTO } from '@user/dto/create-user.dto';
import { UpdateUserDTO } from '@user/dto/update-user.dto';
import { RpcException } from '@nestjs/microservices';
import { Producer } from '@user/shared/queue/producer.service';
import { RedisService } from '@user/shared/cache/redis.service';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private redis: RedisService,
    private producer: Producer,
  ) {}

  async findAll(): Promise<UserDocument[]> {
    const users = await this.userModel.find();

    return users;
  }

  async findUserById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);

    if (!user) throw new RpcException('Cannot find user');

    return user;
  }

  async findUserByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });

    if (!user) throw new RpcException('Cannot find user');

    return user;
  }

  async create(createdUserDto: CreatedUserDTO): Promise<string> {
    const user = await this.findUserByEmail(createdUserDto.email);

    if (user) throw new NotFoundException('User already exists');

    await this.userModel.create(createdUserDto);

    return 'User Created Successfully';
  }

  async update(id: string, updateUserDto: UpdateUserDTO): Promise<string> {
    const user = await this.findUserById(id);

    await user.updateOne(updateUserDto);

    return 'User updated successfully';
  }

  async delete(id: string): Promise<string> {
    const user = await this.findUserById(id);

    await user.deleteOne();

    return 'User deleted successfully';
  }

  async findDriverNearByRestaurantLocation(
    lat: number,
    lng: number,
    radius: number,
  ): Promise<any> {
    const allDrivers = await this.userModel.find({
      where: { role: 'delivery' },
    });
    const client = this.redis.getClient();

    const availableDrivers = [];

    for (const driver of allDrivers) {
      const isOnline = await client.get(`shipper:online:${driver.id}`);
      const isAssigned = await client.sismember(
        'delivery:drivers:assigned',
        driver.id,
      );

      if (isOnline === 'true' && !isAssigned) {
        availableDrivers.push(driver);
      }
    }

    const nearby = await client.georadius(
      'geo:shipper:locations',
      lat,
      lng,
      radius,
      'km',
      'WITHDIST',
    );

    const results: { shipperId: string }[] = [];

    for (const shipperId of nearby) {
      // 2. Kiểm tra online
      const isOnline = await client.get(`shipper:online:${shipperId}`);
      if (isOnline !== 'true') continue;

      // 3. Kiểm tra chưa bị gán đơn
      const isAssigned = await client.sismember(
        'delivery:drivers:assigned',
        shipperId as string,
      );
      if (isAssigned) continue;

      results.push({
        shipperId: shipperId as string,
      });
    }

    return results;
  }

  async pickupDriver(
    lat: number,
    lng: number,
    radius: number,
  ): Promise<UserDocument> {
    const client = this.redis.getClient();
    const cachedKey = `delivery:drivers:assigned`;
    const availableDrivers = await this.findDriverNearByRestaurantLocation(
      lat,
      lng,
      radius,
    );

    const driver =
      availableDrivers[Math.floor(Math.random() * availableDrivers.length)];

    await client.sadd(cachedKey, driver);

    const channel = await this.producer.connect();
    await this.producer.publishExchangeMessage(
      channel,
      'user-order-driver',
      'user-order',
      JSON.stringify({ type: 'user-order-driver', data: driver }),
      'direct',
    );

    return driver;
  }
}
