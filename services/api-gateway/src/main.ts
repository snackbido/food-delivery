import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { HttpExceptionFilter } from '@gateway/filters/http-exception.filter';
import { LoggingInterceptor } from '@gateway/interceptor/logging.interceptor';
import { TransformInterceptor } from '@gateway/interceptor/transform.interceptor';
import { GlobalExceptionFilter } from '@gateway/filters/global-exception.filter';
import { ErrorsInterceptor } from '@gateway/interceptor/error.interceptor';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule);
  const httpAdapter = app.get(HttpAdapterHost);
  // Bảo mật với Helmet
  app.use(helmet());

  // CORS
  app.enableCors();

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(
    new GlobalExceptionFilter(httpAdapter),
    new HttpExceptionFilter(),
  );
  app.useGlobalInterceptors(
    new ErrorsInterceptor(),
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // Prefix for all routes
  app.setGlobalPrefix('/api/v1/');

  const port = process.env.PORT || 5000;

  await app.listen(port);
  logger.log(`API Gateway is running on port ${port}`);
}
bootstrap();
