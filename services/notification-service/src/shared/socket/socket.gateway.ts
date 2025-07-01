import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from '@notification/shared/cache/redis.service';

@WebSocketGateway({
  namespace: '/notifications',
  cors: { origin: '*', credentials: true },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private redisService: RedisService) {}

  async handleConnection(client: Socket) {
    const userId = client.handshake.query['userId'];
    const role = client.handshake.query['role'];
    if (!userId) return;
    if (role === 'shipper') {
      const redis = this.redisService.getClient();
      await redis.set(`shipper:online:${userId}`, 'true');
    }
    client.join(userId);
    console.log(`✅ User ${userId} connected`);
  }

  async handleDisconnect(client: Socket) {
    const userId = client.handshake.query['userId'];
    if (!userId) return;

    const redis = this.redisService.getClient();
    await redis.del(`shipper:online:${userId}`);

    console.log(`❌ Shipper ${userId} disconnected`);
  }

  sendNotification(userId: string, payload: any) {
    this.server.to(userId).emit('notification', payload);
  }
}
