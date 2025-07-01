import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      status: 'false',
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: req.url,
      message:
        exceptionResponse['message'] ||
        exception.message ||
        'Internal server error',
    };
    this.logger.error(`${JSON.stringify(errorResponse)}`);
    res.status(status).json(errorResponse);
  }
}
