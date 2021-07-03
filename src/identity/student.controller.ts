import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { SessionGuard } from './passport/session.guard';

@Controller('profile')
export class ProfileController {
  @UseGuards(SessionGuard)
  @Get('/')
  me(@Request() req: any) {
    return req.user;
  }
}
