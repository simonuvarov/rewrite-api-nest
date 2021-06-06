import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from 'src/identity/events/user-created.event';
import { UsersService } from 'src/identity/users.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class NotificationsService {
  constructor(
    private emailService: EmailService,
    private userService: UsersService,
  ) {}

  @OnEvent('user.created')
  async handleUserCreated(payload: UserCreatedEvent) {
    const token = this.userService.generateEmailVerificationToken({
      email: payload.email,
      uid: payload.id,
    });

    const host =
      process.env.NODE_ENV === 'production' ? 'tryrewrite.com' : 'localhost';

    const link = `https://${host}/api/users/email/verify/${token}`;

    await this.emailService.sendEmail({
      to: payload.email,
      from: 'noreply@tryrewrite.com',
      subject: 'Confirmation email',
      text: `Here's your confirmation link ${link}`,
    });
  }
}
