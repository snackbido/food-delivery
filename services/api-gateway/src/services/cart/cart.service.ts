import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AddCartItemDto } from '@gateway/services/cart/dto/create-cart.dto';
import { UpdateCartItemDto } from '@gateway/services/cart/dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(@Inject('CART_SERVICE') private clientProxy: ClientProxy) {}

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
  async addItemToCart(addCartItemDto: AddCartItemDto) {
    return this.handleProxy('addItem', addCartItemDto);
  }

  async clearCart(userId: string) {
    return this.handleProxy('clearCart', { user_id: userId });
  }

  async getCartByUserId(userId: string) {
    return this.handleProxy('getCartByUserId', { user_id: userId });
  }

  async removeItemFromCart(userId: string, itemId: string) {
    return this.handleProxy('removeItem', { user_id: userId, item_id: itemId });
  }

  async updateItemInCart(
    userId: string,
    itemId: string,
    updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.handleProxy('updateItem', {
      user_id: userId,
      item_id: itemId,
      ...updateCartItemDto,
    });
  }
}
