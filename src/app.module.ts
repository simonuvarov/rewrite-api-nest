import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import * as Joi from 'joi';
import { RedisModule } from 'nestjs-redis';
import { IdentityModule } from './identity/identity.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PapersModule } from './papers/papers.module';

@Module({
  imports: [
    PapersModule,
    IdentityModule,
    EventEmitterModule.forRoot(),
    NotificationsModule,
    //TODO: extract into separate module
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('production', 'development'),
        PORT: Joi.number(),
        DATABASE_URL: Joi.string()
          .regex(/postgres:\/\//)
          .required(),
        SESSION_SECRET: Joi.string().required(),
        LT_URL: Joi.string()
          .regex(/https?:\/\//)
          .required(),
        POSTMARK_API_KEY: Joi.string().required(),
        REDIS_URL: Joi.string().required(),
      }),
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        url: configService.get('REDIS_URL'),
      }),
    }),
  ],
})
export class AppModule {}
