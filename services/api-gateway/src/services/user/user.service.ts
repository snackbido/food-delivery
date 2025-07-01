import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateUserDTO } from '@gateway/services/user/dto/create-user.dto';
import { UpdateUserDTO } from '@gateway/services/user/dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@Inject('USER_SERVICE') private clientProxy: ClientProxy) {}

  async handleProxy(pattern: string, data: any) {
    try {
      const response = await firstValueFrom(
        this.clientProxy.send(pattern, data),
      );

      if (response.error) throw new BadGatewayException(response.error);

      return response;
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async findUserById(id: string): Promise<any> {
    try {
      return await firstValueFrom(this.clientProxy.send('findUserById', id));
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findAll(): Promise<any> {
    try {
      return firstValueFrom(this.clientProxy.send('findAll', []));
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async create(createUserDto: CreateUserDTO): Promise<any> {
    try {
      return await firstValueFrom(
        this.clientProxy.send('create', createUserDto),
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDTO): Promise<any> {
    try {
      return await firstValueFrom(
        this.clientProxy.send('update', { id, updateUserDto }),
      );
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async delete(id: string): Promise<any> {
    try {
      return await firstValueFrom(this.clientProxy.send('delete', id));
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async pickupDriver() {
    return await this.handleProxy('pickupDriver', []);
  }
}
