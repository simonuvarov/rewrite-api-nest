import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { UserCredentialsDto } from './dto/user-credentials';
import { LocalAuthGuard } from './local-auth.guard';
import { UsersService } from './users.service';

@Controller('auth')
export class AuthController {
  constructor(private userService: UsersService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  @HttpCode(204)
  async signin(
    @Body() userCredentialsDto: UserCredentialsDto,
    @Session() session: Record<string, any>,
  ) {
    const user = await this.userService.findByEmail(userCredentialsDto.email);

    session.uid = user.id;
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
}
