import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { AuthController } from './auth.controller';
import { ConfirmationTokenService } from './confirmationToken.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { LocalAuthStrategy } from './passport/local-auth.strategy';
import { SessionGuard } from './passport/session.guard';
import { SessionSerializer } from './passport/session.serializer';
import { UniqueTokenGuard } from './passport/unique-token.guard';
import { UniqueTokenStrategy } from './passport/unique-token.strategy';
import { PasswordService } from './password.service';
import { ProfileController } from './student.controller';
import { StudentService } from './student.service';

@Module({
  controllers: [AuthController, ProfileController],
  providers: [
    PasswordService,
    StudentService,
    PrismaService,
    LocalAuthStrategy,
    LocalAuthGuard,
    SessionGuard,
    SessionSerializer,
    ConfirmationTokenService,
    UniqueTokenGuard,
    UniqueTokenStrategy,
  ],
  imports: [JwtModule.register({ secret: 'hard!to-guess_secret' })],
  exports: [StudentService, ConfirmationTokenService],
})
export class IdentityModule {}
