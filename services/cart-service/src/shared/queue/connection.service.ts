import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class Connection implements OnModuleInit, OnModuleDestroy {
  protected logger = new Logger();
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private url: string;
  constructor(configService: ConfigService) {
    this.url = configService.get<string>('RABBITMQ_URL');
  }

  async onModuleInit() {
    this.channel = await this.connect();
  }

  async connect(): Promise<amqp.Channel> {
    try {
      this.connection = await amqp.connect(this.url);
      this.channel = await this.connection.createChannel();
      this.logger.log('RabbitMQ connected');
      return this.channel;
    } catch (error) {
      this.logger.error('Connection refusing...');
      return;
    }
  }

  closeConnection(connection: amqp.Connection, channel: amqp.Channel) {
    process.once('SIGINT', async () => {
      await channel.close();
      await connection.close();
    });
  }

  onModuleDestroy() {
    this.closeConnection(this.connection, this.channel);
  }
}
