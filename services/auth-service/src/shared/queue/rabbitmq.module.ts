import { Module } from '@nestjs/common';
import { Producer } from '@auth/shared/queue/producer.service';
import { Connection } from './connection.service';
import { Consumer } from './consumer.service';
import { AuthRepository } from '@auth/repository/auth.repository';

@Module({
  providers: [Connection, Producer, Consumer, AuthRepository],
  exports: [Connection, Producer, Consumer],
})
export class RabbitMQModule {}
