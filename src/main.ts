import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import session from 'express-session';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.use(
    session({
      secret: process.env.SECRET,
      name: 'session',
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 10, // 10 mins TODO: get value from env
        secure: process.env.NODE_ENV === 'production' ? true : false,
      },
    }),
  );
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
