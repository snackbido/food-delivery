import { Injectable } from '@nestjs/common';
import { RedisService } from './shared/cached/redis.service';
import { Cart, CartItem } from './interfaces/cart.interface';
import Redis from 'ioredis';
import { AddCartItemDto } from './dto/create-cart.dto';
import { RpcException } from '@nestjs/microservices';
import { UpdateCartItemDto } from './dto/update-cart.dto';
import { RemoveCartItemDto } from './dto/remove-cart.dto';

@Injectable()
export class AppService {
  private readonly CART_TTL = 7200; // 2 hours in seconds
  private readonly CART_KEY_PREFIX = 'cart:';
  private client: Redis;
  constructor(private redis: RedisService) {
    this.client = this.redis.getClient();
  }

  private getCartKey(userId: string): string {
    return `${this.CART_KEY_PREFIX}${userId}`;
  }

  async addItem(addCartItemDto: AddCartItemDto): Promise<Cart> {
    const {
      user_id,
      restaurant_id,
      item_id,
      item_name,
      price,
      quantity,
      notes,
    } = addCartItemDto;
    const cartKey = this.getCartKey(user_id);

    // Get existing cart
    let cart = await this.getCartByUserId(user_id);

    // If cart exists and from different restaurant, clear it
    if (cart && cart.restaurant_id !== restaurant_id) {
      await this.clearCart(user_id);
      cart = null;
    }

    // Create new cart if doesn't exist
    if (!cart) {
      cart = {
        user_id,
        restaurant_id,
        items: [],
        total_items: 0,
        total_amount: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.item_id === item_id,
    );

    if (existingItemIndex > -1) {
      // Update existing item
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].subtotal =
        cart.items[existingItemIndex].quantity *
        cart.items[existingItemIndex].price;
      if (notes) {
        cart.items[existingItemIndex].notes = notes;
      }
    } else {
      // Add new item
      const newItem: CartItem = {
        item_id: item_id,
        item_name: item_name,
        price,
        quantity,
        notes,
        subtotal: price * quantity,
      };
      cart.items.push(newItem);
    }

    // Recalculate totals
    cart.total_items = cart.items.reduce(
      (total, item) => total + item.quantity,
      0,
    );
    cart.total_amount = cart.items.reduce(
      (total, item) => total + item.subtotal,
      0,
    );
    cart.updated_at = new Date().toISOString();

    await this.client.set(cartKey, JSON.stringify(cart), 'EX', this.CART_TTL);

    return cart;
  }

  async updateItem(updateCartItemDto: UpdateCartItemDto): Promise<Cart> {
    const { userId, itemId, quantity, notes } = updateCartItemDto;
    const cartKey = this.getCartKey(userId);

    const cart = await this.getCartByUserId(userId);
    if (!cart) {
      throw new RpcException('Cart not found');
    }

    const itemIndex = cart.items.findIndex((item) => item.item_id === itemId);
    if (itemIndex === -1) {
      throw new RpcException('Item not found in cart');
    }

    // Update item
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].subtotal = cart.items[itemIndex].price * quantity;
    if (notes !== undefined) {
      cart.items[itemIndex].notes = notes;
    }

    // Recalculate totals
    cart.total_items = cart.items.reduce(
      (total, item) => total + item.quantity,
      0,
    );
    cart.total_amount = cart.items.reduce(
      (total, item) => total + item.subtotal,
      0,
    );
    cart.updated_at = new Date().toISOString();

    // Save to Redis
    await this.client.set(cartKey, JSON.stringify(cart), 'EX', this.CART_TTL);

    return cart;
  }

  async removeItem(removeCartItemDto: RemoveCartItemDto): Promise<Cart> {
    const { user_id, item_id } = removeCartItemDto;
    const cartKey = this.getCartKey(user_id);

    const cart = await this.getCartByUserId(user_id);
    if (!cart) {
      throw new RpcException('Cart not found');
    }

    const itemIndex = cart.items.findIndex((item) => item.item_id === item_id);
    if (itemIndex === -1) {
      throw new RpcException('Item not found in cart');
    }

    // Remove item
    cart.items.splice(itemIndex, 1);

    // If cart is empty, delete it
    if (cart.items.length === 0) {
      await this.client.del(cartKey);
      return {
        user_id,
        restaurant_id: cart.restaurant_id,
        items: [],
        total_items: 0,
        total_amount: 0,
        created_at: cart.created_at,
        updated_at: new Date().toISOString(),
      };
    }

    // Recalculate totals
    cart.total_items = cart.items.reduce(
      (total, item) => total + item.quantity,
      0,
    );
    cart.total_amount = cart.items.reduce(
      (total, item) => total + item.subtotal,
      0,
    );
    cart.updated_at = new Date().toISOString();

    // Save to Redis
    await this.client.set(cartKey, JSON.stringify(cart), 'EX', this.CART_TTL);

    return cart;
  }

  async getCartByUserId(userId: string): Promise<Cart | null> {
    const cartKey = this.getCartKey(userId);
    const cartData = await this.client.get(cartKey);

    if (!cartData) {
      return null;
    }

    try {
      return JSON.parse(cartData);
    } catch (error) {
      console.error('Error parsing cart data:', error);
      await this.client.del(cartKey);
      return null;
    }
  }

  async clearCart(userId: string): Promise<void> {
    const cartKey = this.getCartKey(userId);
    await this.client.del(cartKey);
  }

  async getCartSummary(
    userId: string,
  ): Promise<{ total_items: number; total_amount: number } | null> {
    const cart = await this.getCartByUserId(userId);
    if (!cart) {
      return null;
    }

    return {
      total_items: cart.total_items,
      total_amount: cart.total_amount,
    };
  }

  async validateCart(
    userId: string,
  ): Promise<{ isValid: boolean; errors: string[] }> {
    const cart = await this.getCartByUserId(userId);
    const errors: string[] = [];

    if (!cart) {
      errors.push('Cart not found');
      return { isValid: false, errors };
    }

    if (cart.items.length === 0) {
      errors.push('Cart is empty');
    }

    // Add more validation rules as needed
    for (const item of cart.items) {
      if (item.quantity <= 0) {
        errors.push(`Invalid quantity for item ${item.item_name}`);
      }
      if (item.price <= 0) {
        errors.push(`Invalid price for item ${item.item_name}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
