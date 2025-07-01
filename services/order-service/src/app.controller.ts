import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('findAll')
  async findAll(@Payload() data: any) {
    try {
      const { user, restaurant } = data;
      return await this.appService.findAll(user, restaurant);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @MessagePattern('create')
  async create(@Payload() data: any) {
    try {
      return await this.appService.create(data);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @MessagePattern('confirmOrder')
  async confirmOrder(@Payload() id: string) {
    try {
      return await this.appService.confirmedOrder(id);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @MessagePattern('confirmDelivery')
  async confirmDelivery(@Payload() id: string) {
    try {
      return await this.appService.confirmDelivery(id);
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
