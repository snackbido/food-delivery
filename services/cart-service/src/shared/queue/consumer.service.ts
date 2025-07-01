import { Injectable, OnModuleInit } from '@nestjs/common';
import { Connection } from '@cart/shared/queue/connection.service';
import * as amqp from 'amqplib';
import { RedisService } from '@cart/shared/cached/redis.service';
import Redis from 'ioredis';

@Injectable()
export class Consumer implements OnModuleInit {
  constructor(
    private connectionService: Connection,
    private redis: RedisService,
  ) {}

  async onModuleInit() {
    const client: Redis = this.redis.getClient();
    const channel: amqp.Channel = await this.connectionService.connect();
    await this.consumeOrderCreatedFanoutMessage(client, channel);
  }

  async consumeOrderCreatedFanoutMessage(client: Redis, channel: amqp.Channel) {
    if (!channel) {
      channel = await this.connectionService.connect();
    }

    const exchangeName = 'order-created';
    const routingKey = 'user';
    const queueName = 'cart-queue';
    await channel.assertExchange(exchangeName, 'fanout');
    const queue: amqp.Replies.AssertQueue = await channel.assertQueue(
      queueName,
      {
        durable: true,
        autoDelete: false,
      },
    );
    await channel.bindQueue(queue.queue, exchangeName, routingKey);
    channel.consume(queue.queue, async (msg: amqp.ConsumeMessage) => {
      const { type, data } = JSON.parse(msg.content.toString());
      if (type === 'order-created') {
        await client.del(`cart:${data.user_id}`);
      }

      channel.ack(msg);
    });
  }
}
