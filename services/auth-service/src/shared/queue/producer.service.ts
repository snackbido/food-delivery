import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { Connection } from '@auth/shared/queue/connection.service';

@Injectable()
export class Producer extends Connection {
  private producerChannel: amqp.Channel;
  constructor(private configService: ConfigService) {
    super(configService);
  }

  async onModuleInit(): Promise<void> {
    this.producerChannel = await this.connect();
  }

  async publishExchangeMessage(
    channel: amqp.Channel,
    exchangeName: string,
    routingKey: string,
    message: string,
    exchangeType: string,
  ) {
    try {
      if (!channel) {
        channel = this.producerChannel;
      }

      await channel.assertExchange(exchangeName, exchangeType);
      channel.publish(exchangeName, routingKey, Buffer.from(message), {
        persistent: true,
      });
    } catch (error) {
      this.logger.log(error);
    }
  }
}
