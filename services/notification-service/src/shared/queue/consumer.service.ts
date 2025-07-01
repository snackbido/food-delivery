import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from '@notification/email/email.service';
import { NotificationRepository } from '@notification/repository/notification.repository';
import { Connection } from '@notification/shared/queue/connection.service';
import * as amqp from 'amqplib';
import { SocketGateway } from '../socket/socket.gateway';

@Injectable()
export class Consumer implements OnModuleInit {
  private logger = new Logger();

  constructor(
    private connectionService: Connection,
    private emailService: EmailService,
    @InjectRepository(NotificationRepository)
    private notificationRepository: NotificationRepository,
    private socket: SocketGateway,
  ) {}

  async onModuleInit() {
    const channel: amqp.Channel = await this.connectionService.connect();
    await this.consumeCreatedUserDirectMessage(channel);
    await this.consumeOrderPaymentDirectMessage(channel);
    await this.consumeOrderDeliveredFanoutMessage(channel);
  }

  async consumeCreatedUserDirectMessage(channel: amqp.Channel): Promise<void> {
    if (!channel) {
      channel = await this.connectionService.connect();
    }

    const exchangeName = 'forgot-password';
    const routingKey = 'notification';
    const queueName = 'notification-queue';
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
      if (type === 'notification') {
        const data = JSON.parse(msg.content.toString());
        await this.emailService.sendEmail(
          data.email,
          'Forgot Password',
          data.template,
          {
            email: data.email,
            resetLink: data.url,
            appLink: data.appLink,
            appIcon: data.appIcon,
          },
        );
      }

      channel.ack(msg);
    });
  }

  async consumeOrderDeliveredFanoutMessage(
    channel: amqp.Channel,
  ): Promise<void> {
    if (!channel) {
      channel = await this.connectionService.connect();
    }

    const exchangeName = 'delivery-delivered';
    const routingKey = 'delivery';
    const queueName = 'delivery-notification-queue';
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
        console.log(data);
        // const notification = this.notificationRepository.create({
        //   order_id: data.id,
        //   message: 'Đơn hàng đã được giao thành công',
        //   title: 'Giao hàng thành công',
        //   delivery_id: data.delivery_id,
        //   restaurant_id: data.restaurant_id,
        //   user_id: data.user_id,
        // });

        // await this.notificationRepository.save(notification);
        // this.socket.sendNotification(data.user_id, notification);
      }

      channel.ack(msg);
    });
  }

  async consumeOrderCreatedFanoutMessage(channel: amqp.Channel): Promise<void> {
    if (!channel) {
      channel = await this.connectionService.connect();
    }

    const exchangeName = 'order-created';
    const routingKey = 'order';
    const queueName = 'order-notification-queue';
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
        // const notification = this.notificationRepository.create({
        //   order_id: data.id,
        //   message: 'Đơn hàng của bạn đã được tạo thành công',
        //   title: 'Tạo đơn hàng thành công',
        //   restaurant_id: data.restaurant_id,
        //   user_id: data.user_id,
        // });

        // await this.notificationRepository.save(notification);
        // this.socket.sendNotification(data.user_id, notification);
        console.log(data);
      }

      channel.ack(msg);
    });
  }

  async consumeOrderPreparingFanoutMessage(
    channel: amqp.Channel,
  ): Promise<void> {
    if (!channel) {
      channel = await this.connectionService.connect();
    }

    const exchangeName = 'restaurant-order-preparing';
    const routingKey = 'restaurant';
    const queueName = 'restaurant-notification-queue';
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
        // const notification = this.notificationRepository.create({
        //   order_id: data.id,
        //   message: 'Đơn hàng của bạn đã được tạo thành công',
        //   title: 'Tạo đơn hàng thành công',
        //   restaurant_id: data.restaurant_id,
        //   user_id: data.user_id,
        // });

        // await this.notificationRepository.save(notification);
        // this.socket.sendNotification(data.user_id, notification);
        console.log(data);
      }

      channel.ack(msg);
    });
  }

  async consumeOrderReadyFanoutMessage(channel: amqp.Channel): Promise<void> {
    if (!channel) {
      channel = await this.connectionService.connect();
    }

    const exchangeName = 'restaurant-order-ready';
    const routingKey = 'restaurant';
    const queueName = 'restaurant-notification-queue';
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
        // const notification = this.notificationRepository.create({
        //   order_id: data.id,
        //   message: 'Đơn hàng của bạn đã được tạo thành công',
        //   title: 'Tạo đơn hàng thành công',
        //   restaurant_id: data.restaurant_id,
        //   user_id: data.user_id,
        // });

        // await this.notificationRepository.save(notification);
        // this.socket.sendNotification(data.user_id, notification);
        console.log(data);
      }

      channel.ack(msg);
    });
  }

  async consumeOrderCancelledDirectMessage(
    channel: amqp.Channel,
  ): Promise<void> {
    if (!channel) {
      channel = await this.connectionService.connect();
    }

    const exchangeName = 'order-cancelled';
    const routingKey = 'order';
    const queueName = 'order-notification-queue';
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
      if (type === 'order-cancelled') {
        // const notification = this.notificationRepository.create({
        //   order_id: data.id,
        //   message: 'Đơn hàng của bạn đã được tạo thành công',
        //   title: 'Tạo đơn hàng thành công',
        //   restaurant_id: data.restaurant_id,
        //   user_id: data.user_id,
        // });

        // await this.notificationRepository.save(notification);
        // this.socket.sendNotification(data.user_id, notification);
        console.log(data);
      }

      channel.ack(msg);
    });
  }

  async consumeOrderPaymentDirectMessage(channel: amqp.Channel): Promise<void> {
    if (!channel) {
      channel = await this.connectionService.connect();
    }

    const exchangeName = 'payment-notification-created';
    const routingKey = 'payment-notification';
    const queueName = 'payment-notification-queue';
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
      if (type === 'payment-notification-created') {
        const data = JSON.parse(msg.content.toString());
        console.log(data);
        // await this.emailService.sendEmail(
        //   data.email,
        //   'Forgot Password',
        //   data.template,
        //   {
        //     email: data.email,
        //     resetLink: data.url,
        //     appLink: data.appLink,
        //     appIcon: data.appIcon,
        //   },
        // );
      }

      channel.ack(msg);
    });
  }
}
