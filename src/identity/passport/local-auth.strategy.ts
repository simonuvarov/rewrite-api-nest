import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { PasswordService } from '../password.service';
import { StudentService } from '../student.service';

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private studentService: StudentService,
    private passwordService: PasswordService,
  ) {
    super({
      usernameField: 'email',
    });
  }
  async validate(email: string, password: string) {
    const student = await this.studentService.findByEmail(email);
    if (!student)
      throw new UnauthorizedException(
        'Student with this email is not registered',
      );

    if (!student.emailVerified)
      throw new UnauthorizedException('Student has not confirmed email yet');

    const hash = await this.studentService.getHash(student.id);

    const isMatch = await this.passwordService.validatePassword(password, hash);

    if (!isMatch) throw new UnauthorizedException('Password is incorrect');

    return student;
  }
}
