import { HttpModule, Module } from '@nestjs/common';
import { IdentityModule } from 'src/identity/identity.module';
import { PrismaService } from 'src/prisma.service';
import { GrammarService } from './grammar.service';
import { PapersController } from './papers.controller';
import { PapersService } from './papers.service';
import { RuleEngineService } from './rule-engine.service';

@Module({
  controllers: [PapersController],
  providers: [PapersService, PrismaService, GrammarService, RuleEngineService],
  imports: [IdentityModule, HttpModule],
})
export class PapersModule {}
