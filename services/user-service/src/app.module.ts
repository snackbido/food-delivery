import { Module } from '@nestjs/common';
import { AppController } from '@user/app.controller';
import { AppService } from '@user/app.service';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQModule } from '@user/shared/queue/rabbitmq.module';
import { DatabaseConfigModule } from '@user/shared/db/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@user/entity/user.entity';
import { RedisCacheModule } from '@user/shared/cache/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    DatabaseConfigModule,
    RedisCacheModule,
    RabbitMQModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
