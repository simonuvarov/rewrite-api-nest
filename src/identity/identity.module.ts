import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from './auth.service';
import { AuthController } from './identity.controller';
import { PasswordService } from './password.service';
import { UsersService } from './users.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PasswordService, UsersService, PrismaService],
  imports: [JwtModule.register({ secret: 'hard!to-guess_secret' })],
})
export class IdentityModule {}
