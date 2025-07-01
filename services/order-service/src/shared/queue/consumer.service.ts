import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Connection } from '@order/shared/queue/connection.service';
import * as amqp from 'amqplib';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderRepository } from '@order/repository/order.repository';
import { OrderStatus } from '@order/entity/order.entity';

@Injectable()
export class Consumer implements OnModuleInit {
  private logger = new Logger();

  constructor(
    private connectionService: Connection,
    @InjectRepository(OrderRepository) private orderRepository: OrderRepository,
  ) {}

  async onModuleInit() {
    const channel: amqp.Channel = await this.connectionService.connect();
    await this.consumePaymentOrderDirectMessage(channel);
    await this.consumePreparingOrderFanoutMessage(channel);
    await this.consumeReadyOrderFanoutMessage(channel);
    // await this.consumePickupDriverDirectMessage(channel);
  }

  async consumePaymentOrderDirectMessage(channel: amqp.Channel): Promise<void> {
    if (!channel) {
      channel = await this.connectionService.connect();
    }

    const exchangeName = 'payment-order-created';
    const routingKey = 'payment-order';
    const queueName = 'payment-order-queue';
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
      if (type === 'payment-order-created') {
        const order = await this.orderRepository.findOne({
          where: { id: data.order_id },
        });

        order.payment_id = data.id;
        order.is_paid = data.payment_method === 'cash' ? false : true;
        order.status =
          data.status === 'completed' || data.status === 'processing'
            ? OrderStatus.ACCEPTED
            : OrderStatus.PENDING;

        await this.orderRepository.save(order);
      }

      channel.ack(msg);
    });
  }

  async consumePreparingOrderFanoutMessage(
    channel: amqp.Channel,
  ): Promise<void> {
    if (!channel) {
      channel = await this.connectionService.connect();
    }

    const exchangeName = 'restaurant-order-preparing';
    const routingKey = 'restaurant';
    const queueName = 'restaurant-order-queue-preparing';
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
      if (type === 'restaurant-order-preparing') {
        const order = await this.orderRepository.findOne({
          where: { id: data.confirm_order.order_id },
        });
        order.estimated_delivery_time = data.estimated_delivery_time;
        order.status = OrderStatus.PREPARING;
        await this.orderRepository.save(order);
      }

      channel.ack(msg);
    });
  }

  async consumeReadyOrderFanoutMessage(channel: amqp.Channel): Promise<void> {
    if (!channel) {
      channel = await this.connectionService.connect();
    }

    const exchangeName = 'restaurant-order-ready';
    const routingKey = 'restaurant';
    const queueName = 'restaurant-order-queue-ready';
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
      if (type === 'restaurant-order-ready') {
        const order = await this.orderRepository.findOne({
          where: { id: data.confirm_order.order_id },
        });
        order.status = OrderStatus.READY;

        await this.orderRepository.save(order);
      }

      channel.ack(msg);
    });
  }

  async consumeDeliveredOrderFanoutMessage(
    channel: amqp.Channel,
  ): Promise<void> {
    if (!channel) {
      channel = await this.connectionService.connect();
    }

    const exchangeName = 'delivery-order-delivered';
    const routingKey = 'delivery-order';
    const queueName = 'delivery-order-queue';
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
      if (type === 'delivery-order-delivered') {
        const order = await this.orderRepository.findOne({
          where: { id: data.order_id },
        });
        order.status = OrderStatus.DELIVERED;

        await this.orderRepository.save(order);
      }

      channel.ack(msg);
    });
  }

  async consumePickupDriverDirectMessage(
    channel: amqp.Channel,
    orderId: string,
  ): Promise<void> {
    if (!channel) {
      channel = await this.connectionService.connect();
    }

    const exchangeName = 'user-order-driver';
    const routingKey = 'user-order';
    const queueName = 'user-order-queue';
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
      if (type === 'user-order-driver') {
        const order = await this.orderRepository.findOne({
          where: { id: orderId },
        });

        console.log(data);

        order.delivery_person_id = data.id;

        await this.orderRepository.save(order);
      }
      channel.ack(msg);
    });
  }
}
