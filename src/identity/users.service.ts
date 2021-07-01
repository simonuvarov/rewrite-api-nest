import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma.service';
import { UserCredentialsDto } from './dto/user-credentials';
import { UserCreatedEvent } from './events/user-created.event';
import { PasswordService } from './password.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(userCredentialsDto: UserCredentialsDto) {
    const hash = await this.passwordService.hashPassword(
      userCredentialsDto.password,
    );
    const user = await this.prisma.user.create({
      data: { email: userCredentialsDto.email, hash: hash },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
      },
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
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
      },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email: email },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
      },
    });
  }

  async getHash(userId: string) {
    const { hash } = await this.prisma.user.findFirst({
      where: { id: userId },
      select: { hash: true },
    });

    return hash;
  }

  verifyEmail(email: string) {
    return this.prisma.user.update({
      where: { email: email },
      data: { emailVerified: true },
    });
  }

  // update(id: string, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
