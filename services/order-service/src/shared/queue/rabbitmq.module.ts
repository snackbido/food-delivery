import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Connection } from '@order/shared/queue/connection.service';
import { Producer } from '@order/shared/queue/producer.service';
import { Consumer } from '@order/shared/queue/consumer.service';
import { AppService } from '@order/app.service';
import { OrderRepository } from '@order/repository/order.repository';
import { OrderItemRepository } from '@order/repository/order-items.repository';

@Module({
  imports: [ConfigModule],
  providers: [
    Connection,
    Producer,
    Consumer,
    AppService,
    OrderRepository,
    OrderItemRepository,
  ],
  exports: [Connection, Producer, Consumer],
})
export class RabbitMQModule {}
