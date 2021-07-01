import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UniqueTokenGuard extends AuthGuard('token') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // check the token
    await super.canActivate(context);

    // initialize the session
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);

    // if no exceptions were thrown, allow the access to the route
    return true;
  }
}
