import { Controller } from '@nestjs/common';
import { AppService } from '@cart/app.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('addItem')
  async addItem(@Payload() data: any): Promise<any> {
    try {
      return this.appService.addItem(data);
    } catch (error) {
      throw new RpcException(error.message || 'Failed to add item to cart');
    }
  }

  @MessagePattern('clearCart')
  async clearCart(@Payload() data: any): Promise<any> {
    try {
      return this.appService.clearCart(data);
    } catch (error) {
      throw new RpcException(error.message || 'Failed to clear cart');
    }
  }

  @MessagePattern('getCartByUserId')
  async getCartByUserId(@Payload() data: any): Promise<any> {
    try {
      return this.appService.getCartByUserId(data);
    } catch (error) {
      throw new RpcException(error.message || 'Failed to get cart by user ID');
    }
  }

  @MessagePattern('removeItem')
  async removeItem(@Payload() data: any): Promise<any> {
    try {
      return this.appService.removeItem(data);
    } catch (error) {
      throw new RpcException(
        error.message || 'Failed to remove item from cart',
      );
    }
  }

  @MessagePattern('updateItem')
  async updateItem(@Payload() data: any): Promise<any> {
    try {
      return this.appService.updateItem(data);
    } catch (error) {
      throw new RpcException(error.message || 'Failed to update item in cart');
    }
  }
}
