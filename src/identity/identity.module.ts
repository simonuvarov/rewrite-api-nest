import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { AuthController } from './auth.controller';
import { TokenService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { LocalAuthGuard } from './local-auth.guard';
import { LocalAuthStrategy } from './local-auth.strategy';
import { PasswordService } from './password.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [AuthController, UsersController],
  providers: [
    TokenService,
    PasswordService,
    UsersService,
    PrismaService,
    JwtStrategy,
    JwtAuthGuard,
    LocalAuthStrategy,
    LocalAuthGuard,
  ],
  imports: [JwtModule.register({ secret: 'hard!to-guess_secret' })],
  exports: [JwtAuthGuard, UsersService],
})
export class IdentityModule {}
