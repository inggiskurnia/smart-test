import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest<any>();
    const res = http.getResponse<any>();
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          this.logger.info('HTTP Request', {
            context: 'HTTP',
            method: req.method,
            path: req.originalUrl ?? req.url,
            status: res.statusCode,
            durationMs: Date.now() - start,
          });
        },
        error: (err) => {
          this.logger.error('HTTP Request Error', {
            context: 'HTTP',
            method: req.method,
            path: req.originalUrl ?? req.url,
            status: res.statusCode,
            durationMs: Date.now() - start,
            err,
          });
        },
      }),
    );
  }
}
