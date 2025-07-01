import { Module } from '@nestjs/common';
import { AppController } from '@delivery/app.controller';
import { AppService } from '@delivery/app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfigModule } from '@delivery/shared/db/database.module';
import { RabbitMQModule } from './shared/queue/rabbitmq.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Delivery, DeliverySchema } from './entity/delivery.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forFeature([
      { name: Delivery.name, schema: DeliverySchema },
    ]),
    DatabaseConfigModule,
    RabbitMQModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
