import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  status: string;
  statusCode: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        status: context
          .switchToHttp()
          .getResponse()
          .statusCode.toString()
          .startsWith(2)
          ? 'success'
          : 'false',
        statusCode: context.switchToHttp().getResponse().statusCode,
        data,
      })),
    );
  }
}
