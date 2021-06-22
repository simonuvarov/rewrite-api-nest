import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Strategy } from 'passport-local';
import { PasswordService } from './password.service';
import { UsersService } from './users.service';

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
  async validate(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (!user)
      throw new UnauthorizedException('User with this email is not registered');

    const isMatch = await this.passwordService.validatePassword(
      password,
      user.hash,
    );

    if (!isMatch) throw new UnauthorizedException('Password is incorrect');

    return user;
  }
}
