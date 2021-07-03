import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { Student } from '@prisma/client';
import { StudentService } from '../student.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly studentsService: StudentService) {
    super();
  }

  serializeUser(student: Student, done: CallableFunction) {
    done(null, student.id);
  }

  async deserializeUser(studentId: string, done: CallableFunction) {
    const student = await this.studentsService.findOne(studentId);
    done(null, student);
  }
}
