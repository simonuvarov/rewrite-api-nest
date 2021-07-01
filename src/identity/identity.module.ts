import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { AuthController } from './auth.controller';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { LocalAuthStrategy } from './passport/local-auth.strategy';
import { SessionGuard } from './passport/session.guard';
import { SessionSerializer } from './passport/session.serializer';
import { PasswordService } from './password.service';
import { ConfirmationTokenService } from './confirmationToken.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [AuthController, UsersController],
  providers: [
    PasswordService,
    UsersService,
    PrismaService,
    LocalAuthStrategy,
    LocalAuthGuard,
    SessionGuard,
    SessionSerializer,
    ConfirmationTokenService,
  ],
  imports: [JwtModule.register({ secret: 'hard!to-guess_secret' })],
  exports: [UsersService, ConfirmationTokenService],
})
export class IdentityModule {}
