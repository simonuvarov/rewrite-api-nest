import { Module } from '@nestjs/common';
import { EngineModule } from 'src/engine/engine.module';
import { IdentityModule } from 'src/identity/identity.module';
import { PrismaService } from 'src/prisma.service';
import { PapersController } from './papers.controller';
import { PapersService } from './papers.service';

@Module({
  controllers: [PapersController],
  providers: [PapersService, PrismaService],
  imports: [IdentityModule, EngineModule],
})
export class PapersModule {}
