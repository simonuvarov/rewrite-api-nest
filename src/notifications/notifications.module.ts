import { Module } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';
import { IdentityModule } from 'src/identity/identity.module';
import { NotificationsService } from './notifications.service';

@Module({
  providers: [NotificationsService],
  imports: [EmailModule, IdentityModule],
})
export class NotificationsModule {}
