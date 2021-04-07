import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IdentityModule } from './identity/identity.module';
import { PapersModule } from './papers/papers.module';

@Module({
  imports: [PapersModule, IdentityModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
