import { HttpModule, Module } from '@nestjs/common';
import { GrammarService } from './grammar.service';
import { NlpService } from './nlp.service';
import { RuleEngineService } from './rule-engine.class';

@Module({
  providers: [GrammarService, RuleEngineService, NlpService],
  imports: [HttpModule],
  exports: [GrammarService, NlpService, RuleEngineService],
})
export class EngineModule {}
