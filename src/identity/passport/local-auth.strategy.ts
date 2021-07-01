import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { PasswordService } from '../password.service';
import { UsersService } from '../users.service';

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UsersService,
    private passwordService: PasswordService,
  ) {
    super({
      usernameField: 'email',
    });
  }
  async validate(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user)
      throw new UnauthorizedException('User with this email is not registered');

    if (!user.emailVerified)
      throw new UnauthorizedException('User has not confirmed email yet');

    const hash = await this.userService.getHash(user.id);

    const isMatch = await this.passwordService.validatePassword(password, hash);

    if (!isMatch) throw new UnauthorizedException('Password is incorrect');

    return user;
  }
}
