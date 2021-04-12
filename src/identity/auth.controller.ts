import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCredentialsDto } from './dto/user-credentials';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('/signin')
  @HttpCode(200)
  async signin(@Body() userCredentialsDto: UserCredentialsDto) {
    const user = await this.authService.findUserByCredentials(
      userCredentialsDto,
    );
    if (user) {
      const tokens = await this.authService.generateTokens(user);
      return tokens;
    } else
      throw new UnauthorizedException(
        'User not found or the password is wrong',
      );
  }

  @Post('/signup')
  async signup(@Body() userCredentialsDto: UserCredentialsDto) {
    const userAlreadyExists = await this.userService.findByEmail(
      userCredentialsDto.email,
    );
    if (userAlreadyExists)
      throw new ConflictException('This email adress is alrady taken');
    const user = await this.userService.create(userCredentialsDto);
    return this.authService.generateTokens(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/session')
  @HttpCode(204)
  session() {
    return;
  }
}
