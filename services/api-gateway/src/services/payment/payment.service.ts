import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreatePaymentDTO } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(@Inject('PAYMENT_SERVICE') private clientProxy: ClientProxy) {}

  private async handleProxy(pattern: string, data: any) {
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

  async findAll() {
    return await this.handleProxy('findAll', []);
  }

  async create(createPaymentDto: CreatePaymentDTO) {
    return await this.handleProxy('create', createPaymentDto);
  }

  async processPayment(id: string, status: string) {
    return await this.handleProxy('processPayment', { id, status });
  }
}
