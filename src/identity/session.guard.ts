import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import {} from '@nestjs/passport';

@Injectable()
export class SessionGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    //TODO: console.log(request.isAuthenticated());
    return !!request.session.uid;
  }
}
