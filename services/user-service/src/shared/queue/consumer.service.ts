import { Injectable, OnModuleInit } from '@nestjs/common';
import { Connection } from '@user/shared/queue/connection.service';
import * as amqp from 'amqplib';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@user/entity/user.entity';
import { Model } from 'mongoose';
import { RedisService } from '@user/shared/cache/redis.service';

@Injectable()
export class Consumer implements OnModuleInit {
  constructor(
    private connectionService: Connection,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private redis: RedisService,
  ) {}

  async onModuleInit() {
    const channel: amqp.Channel = await this.connectionService.connect();
    await this.consumeCreatedUserDirectMessage(channel);
  }

  async consumeCreatedUserDirectMessage(channel: amqp.Channel): Promise<void> {
    if (!channel) {
      channel = await this.connectionService.connect();
    }

    const exchangeName = 'created-user';
    const routingKey = 'user';
    const queueName = 'user-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const queue: amqp.Replies.AssertQueue = await channel.assertQueue(
      queueName,
      {
        durable: true,
        autoDelete: false,
      },
    );
    await channel.bindQueue(queue.queue, exchangeName, routingKey);
    channel.consume(queue.queue, async (msg: amqp.ConsumeMessage) => {
      const { type } = JSON.parse(msg.content.toString());
      if (type === 'auth') {
        const data = JSON.parse(msg.content.toString());
        await this.userModel.create(data);
      }

      channel.ack(msg);
    });
  }

  async consumeOrderDeliveredDirectMessage(
    channel: amqp.Channel,
  ): Promise<void> {
    if (!channel) {
      channel = await this.connectionService.connect();
    }

    const exchangeName = 'delivery-delivered';
    const routingKey = 'delivery';
    const queueName = 'user-delivery-queue';
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
      const { data, type } = JSON.parse(msg.content.toString());
      if (type === 'delivery-delivered') {
        const client = this.redis.getClient();
        const cachedKey = 'delivery:drivers:assigned';
        await client.srem(cachedKey, data.driver_id);
      }

      channel.ack(msg);
    });
  }
}
