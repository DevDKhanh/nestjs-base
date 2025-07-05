import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class HandlerResultInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (typeof data === 'string') {
          return {
            statusCode: 400,
            message: data,
            timestamp: new Date().toISOString(),
          };
        }

        return {
          statusCode: 200,
          message: 'success',
          data: data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
