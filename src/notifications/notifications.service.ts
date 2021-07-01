import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ConfirmationTokenService } from 'src/identity/confirmationToken.service';
import { UserCreatedEvent } from 'src/identity/events/user-created.event';
import { EmailService } from '../email/email.service';

@Injectable()
export class NotificationsService {
  constructor(
    private emailService: EmailService,
    private confirmationTokenService: ConfirmationTokenService,
  ) {}

  @OnEvent('user.created')
  async handleUserCreated(payload: UserCreatedEvent) {
    const token: string = await this.confirmationTokenService.generate({
      data: {
        email: payload.email,
        userId: payload.id,
      },
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
