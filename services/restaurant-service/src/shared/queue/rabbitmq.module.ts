import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Connection } from '@restaurant/shared/queue/connection.service';
import { Producer } from '@restaurant/shared/queue/producer.service';
import { Consumer } from '@restaurant/shared/queue/consumer.service';
import { RestaurantRepository } from '@restaurant/repository/restaurant.repository';

@Module({
  imports: [ConfigModule],
  providers: [Connection, Producer, Consumer, RestaurantRepository],
  exports: [Connection, Producer, Consumer],
})
export class RabbitMQModule {}
