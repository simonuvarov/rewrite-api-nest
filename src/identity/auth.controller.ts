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
import { TokenService } from './auth.service';
import { UserCredentialsDto } from './dto/user-credentials';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PasswordService } from './password.service';
import { UsersService } from './users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly tokenService: TokenService,
    private userService: UsersService,
    private passwordService: PasswordService,
  ) {}

  @Post('/signin')
  @HttpCode(200)
  async signin(@Body() userCredentialsDto: UserCredentialsDto) {
    const user = await this.userService.findByEmail(userCredentialsDto.email);
    if (!user)
      throw new UnauthorizedException('User with this email is not registered');

    const isMatch = await this.passwordService.validatePassword(
      userCredentialsDto.password,
      user.hash,
    );

    if (!isMatch) throw new UnauthorizedException('Password is incorrect');

    const tokens = await this.tokenService.generateTokens(user);
    return tokens;
  }

  @Post('/signup')
  async signup(@Body() userCredentialsDto: UserCredentialsDto) {
    const userAlreadyExists = await this.userService.findByEmail(
      userCredentialsDto.email,
    );
    if (userAlreadyExists)
      throw new ConflictException('This email address is already taken');
    const user = await this.userService.create(userCredentialsDto);
    return this.tokenService.generateTokens(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/session')
  @HttpCode(204)
  session() {
    return;
  }
}
