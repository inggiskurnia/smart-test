import {
  CallHandler,
  ExecutionContext,
  Global,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { getCtx } from './request-context';

type UserClaim = {
  username: string;
  email: string;
  division: string;
  attribute: string;
};

@Global()
@Injectable()
export class AuthContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<any>();
    const user = req.user as UserClaim | undefined;

    if (user) {
      const ctx = getCtx();
      if (ctx) {
        ctx.actor = {
          username: user.username,
          email: user.email,
          division: user.division,
          attribute: user.attribute,
        };
      }
    }
    return next.handle();
  }
}
