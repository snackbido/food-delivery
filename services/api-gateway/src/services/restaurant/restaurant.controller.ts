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
  Query,
} from '@nestjs/common';
import { RestaurantService } from '@gateway/services/restaurant/restaurant.service';
import { CreateRestaurantDto } from '@gateway/services/restaurant/dto/create_restaurant.dto';
import { UpdateRestaurantDto } from '@gateway/services/restaurant/dto/update_restaurant.dto';
import { SearchRestaurantDto } from '@gateway/services/restaurant/dto/search_restaurant.dto';
import { CreateCategoryDto } from '@gateway/services/restaurant/dto/create_category.dto';
import { UpdateCategoryDto } from '@gateway/services/restaurant/dto/update_category.dto';
import { UpdateMenuItemDto } from '@gateway/services/restaurant/dto/update_menu_item.dto';
import { CreateMenuItemDto } from '@gateway/services/restaurant/dto/create_menu_item.dto';

@Controller('restaurant')
export class RestaurantController {
  constructor(private restaurantService: RestaurantService) {}

  @Get('/findOne/:id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.restaurantService.findOne(id);
  }

  @Get('/findAll')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() data: any) {
    const { page, limit } = data;
    return await this.restaurantService.findAll(page, limit);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRestaurantDto: CreateRestaurantDto): Promise<any> {
    return await this.restaurantService.create(createRestaurantDto);
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return await this.restaurantService.update(id, updateRestaurantDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    return await this.restaurantService.delete(id);
  }

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  async search(@Query() searchRestaurantDto: SearchRestaurantDto) {
    return await this.restaurantService.search(searchRestaurantDto);
  }

  @Get('/find-near-by')
  @HttpCode(HttpStatus.OK)
  async findNearBy(@Query() data: any) {
    const { latitude, longitude, radius } = data;
    return await this.restaurantService.findNearBy(latitude, longitude, radius);
  }

  @Get('/category/:id')
  @HttpCode(HttpStatus.OK)
  async findOneCategory(@Param('id') id: string) {
    return await this.restaurantService.findOneCategory(id);
  }

  @Get('/category')
  @HttpCode(HttpStatus.OK)
  async findAllCategory() {
    return await this.restaurantService.findAllCategory();
  }

  @Post('category')
  @HttpCode(HttpStatus.CREATED)
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<any> {
    return await this.restaurantService.createCategory(createCategoryDto);
  }

  @Patch('category/:id')
  @HttpCode(HttpStatus.OK)
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.restaurantService.updateCategory(id, updateCategoryDto);
  }

  @Delete('category/:id')
  @HttpCode(HttpStatus.OK)
  async deleteCategory(@Param('id') id: string) {
    return await this.restaurantService.deleteCategory(id);
  }

  @Get('category/:categoryId/menu-item')
  @HttpCode(HttpStatus.OK)
  async findMenuItemByCategoryId(@Param('categoryId') id: string) {
    return await this.restaurantService.findMenuItemByCategoryId(id);
  }

  @Get('category/menu-item/:id')
  @HttpCode(HttpStatus.OK)
  async findOneMenuItem(@Param('id') id: string) {
    return await this.restaurantService.findOneMenuItem(id);
  }

  @Get('category/menu-item')
  @HttpCode(HttpStatus.OK)
  async findAllMenuItem() {
    return await this.restaurantService.findAllMenuItem();
  }

  @Post('category/menu-item')
  @HttpCode(HttpStatus.CREATED)
  async createMenuItem(
    @Body() createMenuItemDto: CreateMenuItemDto,
  ): Promise<any> {
    return await this.restaurantService.createMenuItem(createMenuItemDto);
  }

  @Patch('category/menu-item/:id')
  @HttpCode(HttpStatus.OK)
  async updateMenuItem(
    @Param('id') id: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ) {
    return await this.restaurantService.updateCategory(id, updateMenuItemDto);
  }

  @Delete('category/menu-item/:id')
  @HttpCode(HttpStatus.OK)
  async deleteMenuItem(@Param('id') id: string) {
    return await this.restaurantService.deleteMenuItem(id);
  }

  @Get('preparing-order/:id')
  @HttpCode(HttpStatus.OK)
  async preparingOrder(@Param('id') id: string) {
    return await this.restaurantService.preparingOrder(id);
  }

  @Get('ready-order/:id')
  @HttpCode(HttpStatus.OK)
  async readyOrder(@Param('id') id: string) {
    return await this.restaurantService.readyOrder(id);
  }

  @Post('seed/:type')
  @HttpCode(HttpStatus.CREATED)
  async seed(@Param('type') type: string) {
    return await this.restaurantService.seed(type);
  }
}
