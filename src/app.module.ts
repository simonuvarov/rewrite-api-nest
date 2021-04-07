import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PapersModule } from './papers/papers.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [PapersModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
