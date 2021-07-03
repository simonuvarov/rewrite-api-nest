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
import { StudentCredentialsDto } from './dto/student-credentials';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { SessionGuard } from './passport/session.guard';
import { UniqueTokenGuard } from './passport/unique-token.guard';
import { StudentService } from './student.service';

@Controller('auth')
export class AuthController {
  constructor(private studentService: StudentService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  @HttpCode(200)
  async signin(@Req() req: any) {
    // All work here is done by auth strategy and auth guard

    return req.user;
  }

  @Post('/signup')
  @HttpCode(200)
  async signup(@Body() studentCredentialsDto: StudentCredentialsDto) {
    const studentAlreadyExists = await this.studentService.findByEmail(
      studentCredentialsDto.email,
    );
    if (studentAlreadyExists)
      throw new ConflictException('This email address is already taken');
    const newStudent = await this.studentService.create(studentCredentialsDto);
    return newStudent;
  }

  @Post('/signout')
  @UseGuards(SessionGuard)
  @HttpCode(204)
  async signout(@Req() req: Request) {
    req.logout();
  }

  @UseGuards(UniqueTokenGuard)
  @Post('/verify/:token')
  async confirmEmail(@Req() req: any) {
    await this.studentService.verifyEmail(req.user.email);
    const student = this.studentService.findByEmail(req.user.email);

    return student;
  }
}
