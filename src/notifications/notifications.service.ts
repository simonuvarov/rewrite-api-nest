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

    const link = `https://tryrewrite.com/api/users/email/verify/${token}`;

    await this.emailService.sendEmailTemplate({
      templateAlias: 'email-confirmation',
      to: payload.email,
      from: 'Rewrite <notify@tryrewrite.com>',
      variables: { link },
    });
  }
}
