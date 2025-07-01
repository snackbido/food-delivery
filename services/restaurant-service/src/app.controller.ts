import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { Restaurant } from '@restaurant/entity/restaurant.entity';
import { SearchRestaurantDto } from './dto/search_restaurant.dto';
import { CreateRestaurantDto } from './dto/create_restaurant.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('findOne')
  async findOne(@Payload() id: string): Promise<Restaurant> {
    try {
      return await this.appService.findOne(id);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @MessagePattern('findAll')
  async findAll(@Payload() data: any): Promise<{
    restaurants: Restaurant[];
    page: number;
    total: number;
    totalPages: number;
  }> {
    try {
      const { page, limit } = data;
      return await this.appService.findAll(page, limit);
    } catch (error) {
      return error;
    }
  }

  @MessagePattern('create')
  async create(
    @Payload() createRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    try {
      return await this.appService.create(createRestaurantDto);
    } catch (error) {
      console.log(error);
    }
  }

  @MessagePattern('update')
  async update(@Payload() data: any): Promise<string> {
    try {
      const { id, UpdateRestaurantDto } = data;
      return await this.appService.updateRestaurant(id, UpdateRestaurantDto);
    } catch (error) {
      return error;
    }
  }

  @MessagePattern('delete')
  async delete(@Payload() id: string): Promise<string> {
    try {
      return await this.appService.deleteRestaurant(id);
    } catch (error) {
      return error;
    }
  }

  @MessagePattern('search')
  async search(
    @Payload() searchRestaurantDto: SearchRestaurantDto,
  ): Promise<{ restaurants: Restaurant[]; total: number }> {
    try {
      return await this.appService.search(searchRestaurantDto);
    } catch (error) {
      return error;
    }
  }

  @MessagePattern('findNearBy')
  async findNearBy(@Payload() data: any): Promise<Restaurant[]> {
    try {
      const { lat, lng, radius } = data;
      return await this.appService.findNearBy(lat, lng, radius);
    } catch (error) {
      return error;
    }
  }

  @MessagePattern('preparingOrder')
  async preparingOrder(@Payload() id: string): Promise<Restaurant> {
    try {
      return await this.appService.preparingOrder(id);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @MessagePattern('readyOrder')
  async readyOrder(@Payload() id: string): Promise<Restaurant> {
    try {
      return await this.appService.readyOrder(id);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @MessagePattern('seed')
  async seed(@Payload() type: string) {
    try {
      return await this.appService.seedData(type);
    } catch (error) {
      console.log(error);
      throw new RpcException(error);
    }
  }
}
