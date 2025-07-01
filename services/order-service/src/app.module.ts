import { Module } from '@nestjs/common';
import { AppController } from '@order/app.controller';
import { AppService } from '@order/app.service';
import { ConfigModule } from '@nestjs/config';
import { OrderRepository } from '@order/repository/order.repository';
import { OrderItemRepository } from '@order/repository/order-items.repository';
import { RabbitMQModule } from '@order/shared/queue/rabbitmq.module';
import { DatabaseConfigModule } from '@order/shared/db/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    RabbitMQModule,
    DatabaseConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService, OrderRepository, OrderItemRepository],
})
export class AppModule {}
