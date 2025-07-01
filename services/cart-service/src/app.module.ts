import { Module } from '@nestjs/common';
import { AppController } from '@cart/app.controller';
import { AppService } from '@cart/app.service';
import { ConfigModule } from '@nestjs/config';
import { RedisCacheModule } from '@cart/shared/cached/redis.module';
import { RabbitMQModule } from '@cart/shared/queue/rabbitmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RedisCacheModule,
    RabbitMQModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
