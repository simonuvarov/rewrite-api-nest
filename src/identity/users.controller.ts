import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { SessionGuard } from './passport/session.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(SessionGuard)
  @Get('/me')
  me(@Request() req: any) {
    return req.user;
  }
}
