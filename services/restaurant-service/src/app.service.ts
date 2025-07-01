import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from '@restaurant/entity/restaurant.entity';
import { RestaurantRepository } from '@restaurant/repository/restaurant.repository';
import { ElasticsearchService } from '@restaurant/shared/search/elasticsearch.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RpcException } from '@nestjs/microservices';
import { Cache } from 'cache-manager';
import { SearchRestaurantDto } from '@restaurant/dto/search_restaurant.dto';
import { In } from 'typeorm';
import { CreateRestaurantDto } from '@restaurant/dto/create_restaurant.dto';
import { UpdateRestaurantDto } from '@restaurant/dto/update_restaurant.dto';
import { SeedDataService } from '@restaurant/shared/seed/seed.service';
import { Producer } from '@restaurant/shared/queue/producer.service';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(RestaurantRepository)
    private restaurantRepository: RestaurantRepository,
    private elasticsearchService: ElasticsearchService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private producer: Producer,
    private seedService: SeedDataService,
  ) {}

  async seedData(type: string) {
    if (type === 'restaurant') {
      await this.seedService.seedRestaurant();
    } else if (type === 'category') {
      await this.seedService.seedCategory();
    } else {
      await this.seedService.seedMenuItem();
    }
  }

  async findOne(id: string): Promise<Restaurant> {
    const cacheKey = `restaurant:${id}`;
    const cached = await this.cacheManager.get<Restaurant>(cacheKey);

    if (cached) {
      return cached;
    }

    const restaurant = await this.restaurantRepository.findOne({
      where: { id: id, is_active: true },
      relations: ['menu_items'],
    });

    if (!restaurant) throw new RpcException('Restaurant not found');

    await this.cacheManager.set(cacheKey, restaurant, 300);
    return restaurant;
  }

  async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const restaurant = this.restaurantRepository.create({
      name: createRestaurantDto.name,
      description: createRestaurantDto.description,
      address: createRestaurantDto.address,
      latitude: createRestaurantDto.latitude,
      longitude: createRestaurantDto.longitude,
      phone: createRestaurantDto.phone,
      email: createRestaurantDto.email,
      images: createRestaurantDto.images,
      is_active: createRestaurantDto.is_active,
      opening_hours: createRestaurantDto.opening_hours,
      estimated_delivery_time: createRestaurantDto.delivery_fee,
    });
    const savedRestaurant = await this.restaurantRepository.save(restaurant);
    // Index to Elasticsearch
    await this.elasticsearchService.indexRestaurant(savedRestaurant);

    // Clear cache
    await this.clearRestaurantCache();

    return savedRestaurant;
  }

  async preparingOrder(id: string): Promise<Restaurant> {
    const restaurant = await this.findOne(id);

    if (!restaurant.confirm_order.is_confirmed)
      throw new RpcException('Order is not confirmed');

    const channel = await this.producer.connect();
    await this.producer.publishExchangeMessage(
      channel,
      'restaurant-order-preparing',
      'restaurant',
      JSON.stringify({ type: 'restaurant-order-preparing', data: restaurant }),
      'fanout',
    );

    return restaurant;
  }

  async readyOrder(id: string): Promise<Restaurant> {
    const restaurant = await this.findOne(id);

    if (!restaurant.confirm_order.is_confirmed)
      throw new RpcException('Order is not confirmed');
    const channel = await this.producer.connect();
    await this.producer.publishExchangeMessage(
      channel,
      'restaurant-order-ready',
      'restaurant',
      JSON.stringify({ type: 'restaurant-order-ready', data: restaurant }),
      'fanout',
    );
    restaurant.confirm_order = { order_id: '', is_confirmed: false };
    await this.restaurantRepository.save(restaurant);

    return restaurant;
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{
    restaurants: Restaurant[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const cacheKey = `restaurants:page:${page}:limit:${limit}`;
    const cached = await this.cacheManager.get(cacheKey);

    if (cached) {
      return cached as any;
    }

    const [restaurants, total] = await this.restaurantRepository.findAndCount({
      where: { is_active: true },
      take: limit,
      skip: (page * 1 - 1) * limit * 1 || 0,
      order: { rating: 'DESC' },
    });

    const result = {
      restaurants,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };

    await this.cacheManager.set(cacheKey, result, 300);
    return result;
  }

  async search(
    searchRestaurantDto: SearchRestaurantDto,
  ): Promise<{ restaurants: Restaurant[]; total: number }> {
    return await this.elasticsearchService.search(searchRestaurantDto);
  }

  async findNearBy(
    lat: number,
    lng: number,
    radius: number,
  ): Promise<Restaurant[]> {
    const cacheKey = `nearby:${lat}:${lng}:${radius}`;
    const cached = await this.cacheManager.get<Restaurant[]>(cacheKey);

    if (cached) {
      return cached;
    }
    const restaurantIds = await this.elasticsearchService.searchNearBy(
      lat,
      lng,
      radius,
    );

    const restaurants = await this.restaurantRepository.find({
      where: { id: In(restaurantIds) },
    });

    await this.cacheManager.set(cacheKey, restaurants, 300);

    return restaurants;
  }

  async updateRestaurant(
    id: string,
    updateRestaurant: UpdateRestaurantDto,
  ): Promise<string> {
    const restaurant = await this.findOne(id);

    Object.assign(restaurant, updateRestaurant);
    await this.restaurantRepository.save(restaurant);
    await this.elasticsearchService.update(id, restaurant);
    return 'Restaurant has been updated';
  }

  async updateRating(
    id: string,
    newRating: number,
    reviewCount: number,
  ): Promise<void> {
    const restaurant = await this.restaurantRepository.save({
      id,
      rating: newRating,
      total_reviews: reviewCount,
    });

    // Update in Elasticsearch
    await this.elasticsearchService.update(id, restaurant);

    // Clear cache
    await this.cacheManager.del(`restaurant:${id}`);
    await this.clearRestaurantCache();
  }

  async deleteRestaurant(id: string): Promise<string> {
    const restaurant = await this.findOne(id);

    restaurant.is_active = false;

    await this.restaurantRepository.save(restaurant);
    await this.elasticsearchService.deleteRestaurant(id);

    return 'Restaurant is not active';
  }

  async clearRestaurantCache(): Promise<void> {
    const keys: string[] = await this.cacheManager.mget(['restaurant:*']);
    if (keys[0] !== null) {
      await this.cacheManager.mdel(keys);
    }
  }
}
