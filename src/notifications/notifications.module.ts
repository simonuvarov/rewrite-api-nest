import { Module } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';
import { NotificationsService } from './notifications.service';

@Module({ providers: [NotificationsService], imports: [EmailModule] })
export class NotificationsModule {}
