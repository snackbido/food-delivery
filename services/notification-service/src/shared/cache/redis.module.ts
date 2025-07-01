import { Module } from '@nestjs/common';
import { RedisService } from '@notification/shared/cache/redis.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisCacheModule {}
