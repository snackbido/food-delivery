import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Connection } from '@payment/shared/queue/connection.service';
import { Producer } from '@payment/shared/queue/producer.service';
import { Consumer } from '@payment/shared/queue/consumer.service';
import { PaymentRepository } from '@payment/repository/payment.repository';

@Module({
  imports: [ConfigModule],
  providers: [Connection, Producer, Consumer, PaymentRepository],
  exports: [Connection, Producer, Consumer],
})
export class RabbitMQModule {}
