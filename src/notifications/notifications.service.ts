import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ConfirmationTokenService } from 'src/identity/confirmationToken.service';
import { StudentCreatedEvent } from 'src/identity/events/student-created.event';
import { EmailService } from '../email/email.service';

@Injectable()
export class NotificationsService {
  constructor(
    private emailService: EmailService,
    private confirmationTokenService: ConfirmationTokenService,
  ) {}

  @OnEvent('student.created')
  async handleStudentCreated(payload: StudentCreatedEvent) {
    const token: string = await this.confirmationTokenService.generate({
      data: {
        email: payload.email,
        studentId: payload.id,
      },
    });

    const link = `https://tryrewrite.com/verify/${token}`;

    await this.emailService.sendEmailTemplate({
      templateAlias: 'email-confirmation',
      to: payload.email,
      from: 'Rewrite <notify@tryrewrite.com>',
      variables: { link },
    });
  }
}
