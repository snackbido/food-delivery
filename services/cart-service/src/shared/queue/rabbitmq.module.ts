import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Connection } from '@cart/shared/queue/connection.service';
import { Consumer } from '@cart/shared/queue/consumer.service';
import { RedisService } from '@cart/shared/cached/redis.service';

@Module({
  imports: [ConfigModule],
  providers: [Connection, Consumer, RedisService],
  exports: [Connection, Consumer],
})
export class RabbitMQModule {}
