import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { RedisService } from '../cache/redis.service';

@Module({
  providers: [SocketGateway, RedisService],
  exports: [SocketGateway],
})
export class SocketModule {}
