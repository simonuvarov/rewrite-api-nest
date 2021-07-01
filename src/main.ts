import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import createRedisStore from 'connect-redis';
import session from 'express-session';
import ms from 'ms';
import { RedisService } from 'nestjs-redis';
import passport from 'passport';
import { v4 as uuid } from 'uuid';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', 1);
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);

  const RedisStore = createRedisStore(session);

  const redisClient = app.get(RedisService).getClient();

  const isProduction = configService.get('NODE_ENV') === 'production';

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: configService.get('SESSION_SECRET'),
      name: 'session',
      resave: false,
      saveUninitialized: false,
      rolling: true,
      genid: () => uuid(),
      cookie: {
        httpOnly: true,
        maxAge: isProduction ? ms('30d') : ms('1h'),
        secure: isProduction ? true : false,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(configService.get('PORT') || 3000);
}
bootstrap();
