import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from 'src/users/password.service';
import { UsersService } from 'src/users/users.service';
import { UserCredentialsDto } from './dto/user-credentials';

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
    const payload = { id: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '30d' });
    return { accessToken };
  }
}
