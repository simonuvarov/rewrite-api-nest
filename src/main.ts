import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import createRedisStore from 'connect-redis';
import session from 'express-session';
import { createClient } from 'redis';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', 1);
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);

  const RedisStore = createRedisStore(session);

  const redisClient = createClient({
    url: configService.get('REDIS_URL'),
  });

  app.enableCors();
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: configService.get('SESSION_SECRET'),
      name: 'session',
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 10, // 10 mins TODO: get value from env
        secure: configService.get('NODE_ENV') === 'production' ? true : false,
      },
    }),
  );
  await app.listen(configService.get('PORT') || 3000);
}
bootstrap();
