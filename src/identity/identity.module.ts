import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { AuthController } from './auth.controller';
import { LocalAuthGuard } from './local-auth.guard';
import { LocalAuthStrategy } from './local-auth.strategy';
import { PasswordService } from './password.service';
import { SessionGuard } from './session.guard';
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
  ],
  imports: [JwtModule.register({ secret: 'hard!to-guess_secret' })],
  exports: [UsersService],
})
export class IdentityModule {}
