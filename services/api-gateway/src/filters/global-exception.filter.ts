import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  handleValidationErrorDB(err: any): string {
    const errors = Object.values(err.errors).map((el: any) => el.message);
    const message = `${errors[0]}`;
    return message;
  }

  handleCastErrorDB(err: any): string {
    return `Invalid ${err.path}: ${err.value}.`;
  }

  handleJWTError(): string {
    return 'Invalid token. Please log in again!';
  }

  handleJWTExpiredError(): string {
    return 'Your token has expired! Please log in again.';
  }

  handleEmptyError(): string {
    return 'Not data return';
  }

  catch(exception: any, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception.name === 'ValidationError')
      exception.message = this.handleValidationErrorDB(exception);

    if (exception.name === 'CastError')
      exception.message = this.handleCastErrorDB(exception);

    if (exception.name === 'JsonWebTokenError')
      exception.message = this.handleJWTError();

    if (exception.name === 'TokenExpiredError')
      exception.message = this.handleJWTExpiredError();

    if (exception.name === 'EmptyError')
      exception.message = this.handleEmptyError();

    const responseBody =
      process.env.NODE_ENV !== 'production'
        ? {
            status: 'false',
            statusCode: httpStatus,
            message: exception.message,
            stack: exception,
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
          }
        : {
            status: 'false',
            message: exception.message || 'Internal Server Error',
            statusCode: httpStatus,
          };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
