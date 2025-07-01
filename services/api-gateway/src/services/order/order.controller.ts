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
import { OrderService } from '@gateway/services/order/order.service';
import { CreateOrderDTO } from '@gateway/services/order/dto/create-order.dto';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('/user/:user/restaurant/:restaurant')
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Param('user') user: string,
    @Param('restaurant') restaurant: string,
  ) {
    return await this.orderService.findAll(user, restaurant);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findOrder(@Param('id') id: string) {
    return await this.orderService.findOrder(id);
  }

  @Get('/user/:user')
  @HttpCode(HttpStatus.OK)
  async findOrderByUserId(@Param('user') user: string) {
    return await this.orderService.findOrderByUserId(user);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrderDto: CreateOrderDTO) {
    return await this.orderService.create(createOrderDto);
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  async cancel(@Param('id') id: string) {
    return await this.orderService.cancel(id);
  }

  @Get('confirm-order/:id')
  @HttpCode(HttpStatus.OK)
  async confirmOrder(@Param('id') id: string) {
    return await this.orderService.confirmOrder(id);
  }

  @Patch('/confirm-delivery/:id')
  @HttpCode(HttpStatus.OK)
  async confirmDelivery(@Param('id') id: string) {
    return await this.orderService.confirmDelivery(id);
  }
}
