import { Delivery, DeliverySchema } from '@delivery/entity/delivery.entity';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from './connection.service';
import { Producer } from './producer.service';
import { Consumer } from './consumer.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Delivery.name, schema: DeliverySchema },
    ]),
  ],
  providers: [Connection, Producer, Consumer],
  exports: [Connection, Producer, Consumer],
})
export class RabbitMQModule {}
