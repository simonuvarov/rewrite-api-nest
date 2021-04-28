import { HttpModule, Module } from '@nestjs/common';
import { GrammarService } from './grammar.service';
import { LanguageToolService } from './language-tool.service';
import { NlpService } from './nlp.service';
import { RuleEngineService } from './rule-engine.class';

@Module({
  providers: [
    GrammarService,
    RuleEngineService,
    NlpService,
    LanguageToolService,
  ],
  imports: [HttpModule],
  exports: [GrammarService, NlpService, RuleEngineService],
})
export class EngineModule {}
