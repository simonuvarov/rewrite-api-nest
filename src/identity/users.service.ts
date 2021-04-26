import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { UserCredentialsDto } from './dto/user-credentials';
import { UserCreatedEvent } from './events/user-created.event';
import { PasswordService } from './password.service';

interface VerificationData {
  uid: string;
  email: string;
}

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private eventEmitter: EventEmitter2,
    private jwtService: JwtService,
  ) {}

  async create(userCredentialsDto: UserCredentialsDto) {
    const hash = await this.passwordService.hashPassword(
      userCredentialsDto.password,
    );
    const user = await this.prisma.user.create({
      data: { email: userCredentialsDto.email, hash: hash },
      select: { id: true, email: true, createdAt: true, updatedAt: true },
    });

    this.eventEmitter.emit(
      'user.created',
      new UserCreatedEvent(user.id, user.email),
    );

    return user;
  }

  findOne(id: string) {
    return this.prisma.user.findFirst({
      where: { id },
      select: { id: true, email: true, createdAt: true, updatedAt: true },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email: email } });
  }

  verifyEmail(email: string) {
    return this.prisma.user.update({
      where: { email: email },
      data: { emailVerified: true },
    });
  }

  parseEmailVerificationToken(token: string): VerificationData | null {
    try {
      const data = this.jwtService.verify(token);
      return { uid: data.sub, email: data.email };
    } catch (error) {
      return null;
    }
  }

  generateEmailVerificationToken(props: VerificationData): string {
    return this.jwtService.sign(
      { email: props.email },
      { subject: props.uid, expiresIn: '1d' },
    );
  }

  // update(id: string, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
