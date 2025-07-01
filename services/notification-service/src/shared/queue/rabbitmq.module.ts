import { Module } from '@nestjs/common';
import { Consumer } from '@notification/shared/queue/consumer.service';
import { Connection } from '@notification/shared/queue/connection.service';
import { EmailModule } from '@notification/email/email.module';
import { NotificationRepository } from '@notification/repository/notification.repository';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [EmailModule, SocketModule],
  providers: [Consumer, Connection, NotificationRepository],
  exports: [Consumer, Connection],
})
export class RabbitMQModule {}
