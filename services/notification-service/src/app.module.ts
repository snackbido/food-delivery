import { Module } from '@nestjs/common';
import { AppController } from '@notification/app.controller';
import { AppService } from '@notification/app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfigModule } from '@notification/shared/db/db.module';
import { EmailModule } from '@notification/email/email.module';
import { RabbitMQModule } from '@notification/shared/queue/rabbitmq.module';
import { RedisCacheModule } from '@notification/shared/cache/redis.module';
import { SocketModule } from './shared/socket/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    DatabaseConfigModule,
    EmailModule,
    RabbitMQModule,
    RedisCacheModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
