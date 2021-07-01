import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UniqueTokenStrategy as Strategy } from 'passport-unique-token';
import { ConfirmationTokenService } from '../confirmationToken.service';
import { UsersService } from '../users.service';

@Injectable()
export class UniqueTokenStrategy extends PassportStrategy(Strategy, 'token') {
  constructor(
    private userService: UsersService,
    private confirmationTokenService: ConfirmationTokenService,
  ) {
    super({
      failOnMissing: true,
    });
  }
  async validate(token: string) {
    const tokenExists = await this.confirmationTokenService.exists(token);
    if (!tokenExists) throw new UnauthorizedException('Token is not valid');

    const data = await this.confirmationTokenService.get(token);

    const user = await this.userService.findOne(data.userId);

    await this.confirmationTokenService.delete(token);
    return user;
  }
}
