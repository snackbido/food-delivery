import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDTO } from './dto/create-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.paymentService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(createPaymentDto: CreatePaymentDTO) {
    return await this.paymentService.create(createPaymentDto);
  }

  @Patch('/:id/process-payment')
  @HttpCode(HttpStatus.OK)
  async processPayment(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return await this.paymentService.processPayment(id, status);
  }
}
