import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from '../identity/dto/create-user.dto';
import { PasswordService } from './password.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
  ) {}

  async create(userCredentialsDto: CreateUserDto) {
    const hash = await this.passwordService.hashPassword(
      userCredentialsDto.password,
    );
    return this.prisma.user.create({
      data: { email: userCredentialsDto.email, hash: hash },
      select: { id: true, email: true, createdAt: true, updatedAt: true },
    });
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

  // update(id: string, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
