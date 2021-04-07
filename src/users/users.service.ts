import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserCrednetialsDto } from './dto/user-credentials.dto';
import { PasswordService } from './password.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
  ) {}

  async create(userCredentialsDto: UserCrednetialsDto) {
    const hash = await this.passwordService.hashPassword(
      userCredentialsDto.password,
    );
    return this.prisma.user.create({
      data: { email: userCredentialsDto.email, hash: hash },
    });
  }

  findOne(id: string) {
    return this.prisma.user.findFirst({ where: { id } });
  }

  // update(id: string, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
