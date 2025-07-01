import { NestFactory } from '@nestjs/core';
import { AppModule } from '@review/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  const logger = new Logger();

  app.enableCors();

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: configService.get<string>('REVIEW_SERVICE_HOST'),
      port: configService.get<number>('REVIEW_SERVICE_PORT'),
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

  // Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('Review Service API')
    .setDescription('The Review Service API description')
    .setVersion('1.0')
    .addTag('review')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);

  logger.log(`Review Service running on port ${port}`);
}
bootstrap();
