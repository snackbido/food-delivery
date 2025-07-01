import { Module } from '@nestjs/common';
import { AppController } from '@payment/app.controller';
import { AppService } from '@payment/app.service';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQModule } from '@payment/shared/queue/rabbitmq.module';
import { DatabaseConfigModule } from '@payment/shared/db/database.module';
import { PaymentRepository } from '@payment/repository/payment.repository';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    RabbitMQModule,
    DatabaseConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService, PaymentRepository],
})
export class AppModule {}
