import { Module } from '@nestjs/common';
import { AppController } from '@auth/app.controller';
import { AppService } from '@auth/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthRepository } from '@auth/repository/auth.repository';
import { RabbitMQModule } from '@auth/shared/queue/rabbitmq.module';
import { DatabaseConfigModule } from '@auth/shared/database/db.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    DatabaseConfigModule,
    RabbitMQModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES') },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AuthRepository],
})
export class AppModule {}
