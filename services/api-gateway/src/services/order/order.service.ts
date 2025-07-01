import {
  BadGatewayException,
  Inject,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateOrderDTO } from '@gateway/services/order/dto/create-order.dto';
import { JwtAuthGuard } from '@gateway/services/auth/guard/auth.guard';
import { RolesGuard } from '@gateway/services/auth/guard/role.guard';
import { Roles } from '@gateway/services/auth/decorator/role.decorator';

@Injectable()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(['customer'])
export class OrderService {
  constructor(@Inject('ORDER_SERVICE') private clientProxy: ClientProxy) {}

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

  async findAll(user: string, restaurant: string) {
    return await this.handleProxy('findAll', { user, restaurant });
  }

  async findOrder(id: string) {
    return await this.handleProxy('findOrder', id);
  }

  async findOrderByUserId(user: string) {
    return await this.handleProxy('findOrderByUserId', user);
  }

  async create(createOrderDto: CreateOrderDTO) {
    return await this.handleProxy('create', createOrderDto);
  }

  async cancel(id: string) {
    return await this.handleProxy('cancel', id);
  }

  async confirmOrder(id: string) {
    return await this.handleProxy('confirmOrder', id);
  }

  async confirmDelivery(id: string) {
    return await this.handleProxy('confirmDelivery', id);
  }

  async delete(id: string) {
    return await this.handleProxy('delete', id);
  }
}
