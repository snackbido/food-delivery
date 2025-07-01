import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { AppService } from '@user/app.service';
import { CreatedUserDTO } from '@user/dto/create-user.dto';
import { User } from '@user/entity/user.entity';

@Controller()
export class AppController {
  private logger = new Logger();
  constructor(private readonly appService: AppService) {}

  @MessagePattern('findAll')
  async findAll() {
    try {
      return await this.appService.findAll();
    } catch (error) {
      this.logger.error(error);
      return;
    }
  }

  @MessagePattern('pickupDriver')
  async pickupDriver(
    @Payload() data: { lat: number; lng: number; radius: number },
  ): Promise<User> {
    try {
      return await this.appService.pickupDriver(
        data.lat,
        data.lng,
        data.radius,
      );
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @MessagePattern('findUserById')
  async findUserById(@Payload() id: string): Promise<User> {
    return await this.appService.findUserById(id);
  }

  @MessagePattern('create')
  async create(createUserDto: CreatedUserDTO): Promise<string> {
    return await this.appService.create(createUserDto);
  }
}
