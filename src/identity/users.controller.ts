import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { isJWT } from 'class-validator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  me(@Request() req: any) {
    return this.usersService.findOne(req.user.id);
  }

  @Get('/email/verify/:token')
  @HttpCode(204)
  async confirmEmail(@Param('token') token: string) {
    if (!isJWT(token))
      throw new BadRequestException('token must be a valid JWT');

    const tokenData = this.usersService.parseEmailVerificationToken(token);

    if (!tokenData)
      throw new BadRequestException('email verification token is not valid');

    await this.usersService.verifyEmail(tokenData.email);
    return;
  }
}
