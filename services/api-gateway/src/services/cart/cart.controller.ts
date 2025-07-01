import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CartService } from '@gateway/services/cart/cart.service';
import { UpdateCartItemDto } from '@gateway/services/cart/dto/update-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addItemToCart(addCartItemDto: any) {
    return this.cartService.addItemToCart(addCartItemDto);
  }

  @Delete('clear/:userId')
  @HttpCode(HttpStatus.OK)
  async clearCart(@Param('userId') userId: string) {
    return this.cartService.clearCart(userId);
  }

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  async getCart(@Param('userId') userId: string) {
    return this.cartService.getCartByUserId(userId);
  }

  @Delete('remove-item/:userId/:itemId')
  async removeItemFromCart(
    @Param('userId') userId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.cartService.removeItemFromCart(userId, itemId);
  }

  @Patch('update-item/:userId/:itemId')
  @HttpCode(HttpStatus.OK)
  async updateItemInCart(
    @Param('userId') userId: string,
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItemInCart(userId, itemId, updateCartItemDto);
  }
}
