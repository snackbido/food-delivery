import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    ConfigModule,
    CacheModule.registerAsync({
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (configService: ConfigService) => ({
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
        store: redisStore,
        ttl: 300,
      }),
    }),
  ],
})
export class RedisCacheModule {}
