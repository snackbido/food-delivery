import { Module } from '@nestjs/common';
import { Consumer } from '@user/shared/queue/consumer.service';
import { Connection } from '@user/shared/queue/connection.service';
import { User, UserSchema } from '@user/entity/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Producer } from '@user/shared/queue/producer.service';
import { RedisService } from '@user/shared/cache/redis.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [Consumer, Connection, Producer, RedisService],
  exports: [Consumer, Connection, Producer],
})
export class RabbitMQModule {}
