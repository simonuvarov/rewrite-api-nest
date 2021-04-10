import { Module } from '@nestjs/common';
import { IdentityModule } from './identity/identity.module';
import { PapersModule } from './papers/papers.module';

@Module({
  imports: [PapersModule, IdentityModule],
})
export class AppModule {}
