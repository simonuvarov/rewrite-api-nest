import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma.service';
import { StudentCredentialsDto } from './dto/student-credentials';
import { StudentCreatedEvent } from './events/student-created.event';
import { PasswordService } from './password.service';

@Injectable()
export class StudentService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(studentCredentialsDto: StudentCredentialsDto) {
    const hash = await this.passwordService.hashPassword(
      studentCredentialsDto.password,
    );
    const student = await this.prisma.student.create({
      data: { email: studentCredentialsDto.email, hash: hash },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
      },
    });

    this.eventEmitter.emit(
      'student.created',
      new StudentCreatedEvent(student.id, student.email),
    );

    return student;
  }

  findOne(id: string) {
    return this.prisma.student.findFirst({
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
    return this.prisma.student.findFirst({
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

  async getHash(studentId: string) {
    const { hash } = await this.prisma.student.findFirst({
      where: { id: studentId },
      select: { hash: true },
    });

    return hash;
  }

  verifyEmail(email: string) {
    return this.prisma.student.update({
      where: { email: email },
      data: { emailVerified: true },
    });
  }

  // update(id: string, updateStudentDto: UpdateStudentDto) {
  //   return `This action updates a #${id} student`;
  // }

  remove(id: string) {
    return this.prisma.student.delete({ where: { id } });
  }
}
