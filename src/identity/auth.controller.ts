import {
  Body,
  ConflictException,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCredentialsDto } from './dto/user-credentials';
import { UsersService } from './users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('/signin')
  async signin(@Body() userCredentialsDto: UserCredentialsDto) {
    const user = await this.authService.findUserByCredentials(
      userCredentialsDto,
    );
    if (user) return this.authService.generateTokens(user);
    else
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
}
