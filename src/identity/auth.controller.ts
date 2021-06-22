import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { TokenService } from './auth.service';
import { UserCredentialsDto } from './dto/user-credentials';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { PasswordService } from './password.service';
import { UsersService } from './users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly tokenService: TokenService,
    private userService: UsersService,
    private passwordService: PasswordService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  @HttpCode(200)
  async signin(
    @Body() userCredentialsDto: UserCredentialsDto,
    @Session() session: Record<string, any>,
  ) {
    const user = await this.userService.findByEmail(userCredentialsDto.email);

    const tokens = await this.tokenService.generateTokens(user);
    session.uid = user.id;
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
