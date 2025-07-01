import { Logger, Module } from '@nestjs/common';
import { CategoryRepository } from '@restaurant/repository/category.repository';
import { MenuItemRepository } from '@restaurant/repository/menu_item.repository';
import { RestaurantRepository } from '@restaurant/repository/restaurant.repository';
import { SeedDataService } from '@restaurant/shared/seed/seed.service';
import { ElasticsearchService } from '../search/elasticsearch.service';

@Module({
  providers: [
    SeedDataService,
    RestaurantRepository,
    CategoryRepository,
    MenuItemRepository,
    Logger,
    ElasticsearchService,
  ],
  exports: [SeedDataService],
})
export class SeedModule {}
