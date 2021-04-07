import { Module } from '@nestjs/common';
import { IdentityModule } from 'src/identity/identity.module';
import { PrismaService } from 'src/prisma.service';
import { PapersController } from './papers.controller';
import { PapersService } from './papers.service';

@Module({
  controllers: [PapersController],
  providers: [PapersService, PrismaService],
  imports: [IdentityModule],
})
export class PapersModule {}
