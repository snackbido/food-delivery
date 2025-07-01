import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateRestaurantDto } from '@gateway/services/restaurant/dto/create_restaurant.dto';
import { UpdateRestaurantDto } from '@gateway/services/restaurant/dto/update_restaurant.dto';
import { SearchRestaurantDto } from '@gateway/services/restaurant/dto/search_restaurant.dto';
import { CreateCategoryDto } from '@gateway/services/restaurant/dto/create_category.dto';
import { CreateMenuItemDto } from '@gateway/services/restaurant/dto/create_menu_item.dto';
import { UpdateMenuItemDto } from '@gateway/services/restaurant/dto/update_menu_item.dto';

@Injectable()
export class RestaurantService {
  constructor(@Inject('RESTAURANT_SERVICE') private clientProxy: ClientProxy) {}

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

  async findOne(id: string) {
    return await this.handleProxy('findOne', id);
  }

  async findAll(page: number, limit: number) {
    return await this.handleProxy('findAll', { page, limit });
  }

  async create(createRestaurantDto: CreateRestaurantDto): Promise<any> {
    return await this.handleProxy('create', createRestaurantDto);
  }

  async update(id: string, updateRestaurantDto: UpdateRestaurantDto) {
    return await this.handleProxy('update', { id, updateRestaurantDto });
  }

  async delete(id: string) {
    return await this.handleProxy('delete', id);
  }

  async search(searchRestaurantDto: SearchRestaurantDto) {
    return await this.handleProxy('search', searchRestaurantDto);
  }

  async findNearBy(lat: number, lng: number, radius: number) {
    return await this.handleProxy('findNearBy', { lat, lng, radius });
  }

  async findOneCategory(id: string) {
    return await this.handleProxy('findOneCategory', id);
  }

  async findAllCategory() {
    return await this.handleProxy('findAllCategory', 'ok');
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    return await this.handleProxy('createCategory', createCategoryDto);
  }

  async updateCategory(id: string, updateRestaurantDto: UpdateRestaurantDto) {
    return await this.handleProxy('updateCategory', {
      id,
      updateRestaurantDto,
    });
  }

  async deleteCategory(id: string) {
    return await this.handleProxy('deleteCategory', id);
  }

  async findMenuItemByCategoryId(categoryId: string) {
    return await this.handleProxy('findMenuItemByCategoryId', categoryId);
  }

  async findOneMenuItem(id: string) {
    return await this.handleProxy('findOneMenuItem', id);
  }

  async findAllMenuItem() {
    return await this.handleProxy('findAllMenuItem', '');
  }

  async createMenuItem(createMenuItemDto: CreateMenuItemDto) {
    return await this.handleProxy('createMenuItem', createMenuItemDto);
  }

  async updateMenuItem(id: string, updateMenuItemDto: UpdateMenuItemDto) {
    return await this.handleProxy('updateMenuItem', { id, updateMenuItemDto });
  }

  async deleteMenuItem(id: string) {
    return await this.handleProxy('deleteMenuItem', id);
  }

  async preparingOrder(id: string) {
    return await this.handleProxy('preparingOrder', id);
  }

  async readyOrder(id: string) {
    return await this.handleProxy('readyOrder', id);
  }

  async seed(type: string) {
    return await this.handleProxy('seed', type);
  }
}
