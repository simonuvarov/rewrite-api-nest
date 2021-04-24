import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { IdentityModule } from './identity/identity.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PapersModule } from './papers/papers.module';

@Module({
  imports: [
    PapersModule,
    IdentityModule,
    EventEmitterModule.forRoot(),
    NotificationsModule,
  ],
})
export class AppModule {}
