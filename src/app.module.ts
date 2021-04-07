import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PapersModule } from './papers/papers.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PapersModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
