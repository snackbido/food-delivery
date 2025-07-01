import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Restaurant } from '@restaurant/entity/restaurant.entity';

@Injectable()
export class RestaurantRepository extends Repository<Restaurant> {
  constructor(private dataSource: DataSource) {
    super(Restaurant, dataSource.createEntityManager());
  }
}
