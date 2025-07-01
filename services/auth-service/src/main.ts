import { NestFactory } from '@nestjs/core';
import { AppModule } from '@auth/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  const logger = new Logger();

  app.enableCors();

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: configService.get<string>('AUTH_SERVICE_HOST'),
      port: configService.get<number>('AUTH_SERVICE_PORT'),
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.startAllMicroservices();

  await app.listen(port);

  logger.log(`Auth Service running on port ${port}`);
}
bootstrap();
