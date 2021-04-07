import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PasswordService } from './password.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [AuthController, UsersController],
  providers: [
    AuthService,
    PasswordService,
    UsersService,
    PrismaService,
    JwtStrategy,
  ],
  imports: [JwtModule.register({ secret: 'hard!to-guess_secret' })],
})
export class IdentityModule {}
