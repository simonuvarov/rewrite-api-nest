import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PapersController } from './papers.controller';
import { PapersService } from './papers.service';

@Module({
  controllers: [PapersController],
  providers: [PapersService, PrismaService],
})
export class PapersModule {}
