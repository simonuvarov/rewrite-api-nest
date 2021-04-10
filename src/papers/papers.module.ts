import { HttpModule, Module } from '@nestjs/common';
import { IdentityModule } from 'src/identity/identity.module';
import { PrismaService } from 'src/prisma.service';
import { GrammarService } from './grammar.service';
import { PapersController } from './papers.controller';
import { PapersService } from './papers.service';

@Module({
  controllers: [PapersController],
  providers: [PapersService, PrismaService, GrammarService],
  imports: [IdentityModule, HttpModule],
})
export class PapersModule {}
