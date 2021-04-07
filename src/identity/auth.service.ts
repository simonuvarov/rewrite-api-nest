import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from 'src/identity/password.service';
import { jwtConstants } from './constants';
import { UserCredentialsDto } from './dto/user-credentials';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private passwordService: PasswordService,
    private userService: UsersService,
  ) {}

  async validateUserAndReturn(userCredentialsDto: UserCredentialsDto) {
    const user = await this.userService.findByEmail(userCredentialsDto.email);
    if (!user) return null;

    const isMatch = await this.passwordService.validatePassword(
      userCredentialsDto.password,
      user.hash,
    );

    if (!isMatch) return null;

    return user;
  }

  async generateTokens(user: { id: string }) {
    const accessToken = this.jwtService.sign(
      {},
      { expiresIn: '30d', subject: user.id, secret: jwtConstants.secret },
    );
    return { accessToken };
  }
}
