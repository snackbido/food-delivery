import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger(LoggingInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const { method, url, headers } = req;
    const userAgent = headers['user-agent'] || '';
    this.logger.log(`${method} - ${url} - ${userAgent}`);

    const now = Date.now();
    return next.handle().pipe(
      tap({
        next: () => {
          const res = context.switchToHttp().getResponse();
          this.logger.log(`${res.statusCode} - ${Date.now() - now}ms`);
        },
        error: (err) => {
          this.logger.error(`Error: ${err.message}`);
        },
      }),
    );
  }
}
