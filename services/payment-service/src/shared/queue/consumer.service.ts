import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentStatus } from '@payment/entity/payment.entity';
import { PaymentRepository } from '@payment/repository/payment.repository';
import { Connection } from '@payment/shared/queue/connection.service';
import * as amqp from 'amqplib';

@Injectable()
export class Consumer implements OnModuleInit {
  constructor(
    private connectionService: Connection,
    @InjectRepository(PaymentRepository)
    private paymentRepository: PaymentRepository,
  ) {}

  async onModuleInit() {
    const channel: amqp.Channel = await this.connectionService.connect();
    await this.consumeCreatingOrderDirectMessage(channel);
  }

  async consumeCreatingOrderDirectMessage(
    channel: amqp.Channel,
  ): Promise<void> {
    if (!channel) {
      channel = await this.connectionService.connect();
    }

    const exchangeName = 'order-payment-created';
    const routingKey = 'order-payment';
    const queueName = 'order-payment-queue';
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
      const { data, type, method, gateway } = JSON.parse(
        msg.content.toString(),
      );
      if (type === 'order-payment-created') {
        const payment = this.paymentRepository.create({
          order_id: data.id,
          user_id: data.user_id,
          payment_method: method,
          transaction_id: `TXN_${Date.now()}`,
          amount: data.total,
          status: PaymentStatus.PENDING,
          payment_gateway: method === 'cash' ? null : gateway,
        });
        await this.paymentRepository.save(payment);
      }

      channel.ack(msg);
    });
  }
}
