import { NestFactory } from '@nestjs/core';
import { AppModule } from '@cart/app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  const logger = new Logger();

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: configService.get<string>('CART_SERVICE_HOST'),
      port: configService.get<number>('CART_SERVICE_PORT'),
    },
  });

  await app.startAllMicroservices();
  await app.listen(port);
  logger.log(`Cart service running on port ${port}`);
}
bootstrap();
