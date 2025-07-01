import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { Connection } from '@delivery/shared/queue/connection.service';
import { InjectModel } from '@nestjs/mongoose';
import { Delivery, DeliveryDocument } from '@delivery/entity/delivery.entity';
import { Model } from 'mongoose';

@Injectable()
export class Consumer implements OnModuleInit {
  private logger = new Logger();

  constructor(
    @InjectModel(Delivery.name) private deliveryModel: Model<DeliveryDocument>,
    private connectionService: Connection,
  ) {}

  async onModuleInit() {
    const channel: amqp.Channel = await this.connectionService.connect();
    await this.consumeDeliveryOrderDirectMessage(channel);
  }

  async consumeDeliveryOrderDirectMessage(
    channel: amqp.Channel,
  ): Promise<void> {
    if (!channel) {
      channel = await this.connectionService.connect();
    }

    const exchangeName = 'order-delivery-delivering';
    const routingKey = 'order-delivery';
    const queueName = 'order-delivery-queue';
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
      const { data, type } = JSON.parse(msg.content.toString());
      if (type === 'order-delivery-delivering') {
        await this.deliveryModel.create({
          order_id: data.id,
          customer_id: data.user_id,
          restaurant_id: data.restaurant_id,
          driver_id: data.delivery_person_id,
          delivery_location: data.delivery_address,
          estimated_delivery_time: data.estimated_delivery_time,
          delivery_fee: data.delivery_fee,
        });
      }
      channel.ack(msg);
    });
  }
}
