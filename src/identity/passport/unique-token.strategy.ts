import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UniqueTokenStrategy as Strategy } from 'passport-unique-token';
import { ConfirmationTokenService } from '../confirmationToken.service';
import { StudentService } from '../student.service';

@Injectable()
export class UniqueTokenStrategy extends PassportStrategy(Strategy, 'token') {
  constructor(
    private studentService: StudentService,
    private confirmationTokenService: ConfirmationTokenService,
  ) {
    super({
      failOnMissing: true,
    });
  }
  async validate(token: string) {
    const tokenExists = await this.confirmationTokenService.exists(token);
    if (!tokenExists) throw new UnauthorizedException('Token is not valid');

    const data = await this.confirmationTokenService.get(token);

    const student = await this.studentService.findOne(data.studentId);

    await this.confirmationTokenService.delete(token);
    return student;
  }
}
