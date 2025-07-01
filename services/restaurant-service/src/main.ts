import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from '@restaurant/app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { GlobalExceptionFilter } from '@restaurant/filters/global_exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  const httpAdapter = app.get(HttpAdapterHost);

  const logger = new Logger();

  app.enableCors();

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: configService.get<string>('RESTAURANT_SERVICE_HOST'),
      port: configService.get<number>('RESTAURANT_SERVICE_PORT'),
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapter));

  await app.startAllMicroservices();

  await app.listen(port);

  logger.log(`Restaurant Service running on port ${port}`);
}
bootstrap();
