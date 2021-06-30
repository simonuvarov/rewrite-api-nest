import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { UserCredentialsDto } from './dto/user-credentials';
import { LocalAuthGuard } from './local-auth.guard';
import { SessionGuard } from './session.guard';
import { UsersService } from './users.service';

@Controller('auth')
export class AuthController {
  constructor(private userService: UsersService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  @HttpCode(200)
  async signin(@Req() req: any) {
    // All work here is done by auth strategy and auth guard

    return req.user;
  }

  @Post('/signup')
  @HttpCode(204)
  async signup(@Body() userCredentialsDto: UserCredentialsDto) {
    const userAlreadyExists = await this.userService.findByEmail(
      userCredentialsDto.email,
    );
    if (userAlreadyExists)
      throw new ConflictException('This email address is already taken');
    await this.userService.create(userCredentialsDto);
    return;
  }

  @Post('/signout')
  @UseGuards(SessionGuard)
  @HttpCode(204)
  async signout(@Req() req: Request) {
    req.logout();
  }
}
