import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as amqp from 'amqplib';
import { Connection } from './connection.service';
import { RestaurantRepository } from '@restaurant/repository/restaurant.repository';

@Injectable()
export class Consumer implements OnModuleInit {
  private logger = new Logger();

  constructor(
    @InjectRepository(RestaurantRepository)
    private restaurantRepository: RestaurantRepository,
    private connectionService: Connection,
  ) {}

  async onModuleInit() {
    const channel: amqp.Channel = await this.connectionService.connect();
    await this.consumeConfirmedOrderFanoutMessage(channel);
  }

  async consumeConfirmedOrderFanoutMessage(
    channel: amqp.Channel,
  ): Promise<void> {
    if (!channel) {
      channel = await this.connectionService.connect();
    }

    const exchangeName = 'order-created';
    const routingKey = 'order';
    const queueName = 'order-restaurant-queue';
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
      if (type === 'order-created') {
        const restaurant = await this.restaurantRepository.findOne({
          where: { id: data.restaurant_id },
        });
        restaurant.confirm_order = {
          order_id: data.id,
          is_confirmed: true,
        };

        await this.restaurantRepository.save(restaurant);
      }
      channel.ack(msg);
    });
  }
}
