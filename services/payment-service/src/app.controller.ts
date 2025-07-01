import { Controller } from '@nestjs/common';
import { AppService } from '@payment/app.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { Payment } from '@payment/entity/payment.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('findAll')
  async findAll(): Promise<Payment[]> {
    try {
      return await this.appService.findAll();
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @MessagePattern('processPayment')
  async processPayment(@Payload() data: any): Promise<Payment> {
    try {
      const { id, status } = data;
      return await this.appService.processPayment(id, status);
    } catch (error) {
      return;
    }
  }
}
