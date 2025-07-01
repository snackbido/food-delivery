import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfigModule } from '@restaurant/shared/db/db.module';
import { ElasticsearchModule } from '@restaurant/shared/search/elasticsearch.module';
import { RedisCacheModule } from '@restaurant/shared/cache/redis.module';
import { RestaurantRepository } from '@restaurant/repository/restaurant.repository';
import { ElasticsearchService } from '@restaurant/shared/search/elasticsearch.service';
import { MenuItemModule } from '@restaurant/services/menu_item/menu_item.module';
import { CategoryModule } from '@restaurant/services/category/category.module';
import { SeedModule } from '@restaurant/shared/seed/seed.module';
import { RabbitMQModule } from '@restaurant/shared/queue/rabbitmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    DatabaseConfigModule,
    ElasticsearchModule,
    RedisCacheModule,
    MenuItemModule,
    CategoryModule,
    SeedModule,
    RabbitMQModule,
  ],
  controllers: [AppController],
  providers: [AppService, RestaurantRepository, ElasticsearchService],
})
export class AppModule {}
