import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger();

  use(req: any, res: any, next: (error?: Error | any) => void) {
    const { originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    const correlationId = req.headers['x-correlation-id'];

    res.on('finish', () => {
      const { statusCode } = res;
      console.log(statusCode);
      const contentLength = res.get('content-length');
      this.logger.log(
        `${originalUrl} ${statusCode} ${contentLength} - ${userAgent}  ${correlationId}`,
      );
    });

    next();
  }
}
