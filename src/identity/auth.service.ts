import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  async generateTokens(user: { id: string }) {
    const accessToken = this.jwtService.sign(
      {},
      { expiresIn: '30d', subject: user.id, secret: process.env.JWT_SECRET },
    );
    return { accessToken };
  }
}
