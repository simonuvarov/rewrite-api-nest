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
    await this.emailService.sendEmail({
      to: payload.email,
      from: 'noreply@tryrewrite.com',
      subject: 'User created event',
      text: `User with id: ${payload.id} with email: ${
        payload.email
      } has been created. Here's your confirmation token: ${this.userService.generateEmailVerificationToken(
        { email: payload.email, uid: payload.id },
      )}`,
    });
  }
}
