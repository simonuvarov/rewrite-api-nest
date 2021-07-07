import { v4 as uuid } from 'uuid';
import { CRITERIA_TYPE } from '../criteria-type.enum';
import { BaseRule } from './_base.rule';
import { ParsedPaper } from './_parsed-paper.class';

export class PassiveVoiceRule extends BaseRule {
  affects = CRITERIA_TYPE.GR;

  async _execute(parsedPaper: ParsedPaper) {
    const match = parsedPaper.parsedBody.match('#Verb * #Participle');
    const matchCount = match.out('array').length;

    if (matchCount >= 2) this.score = 2;
    else if (matchCount === 1) this.score = 1;
    else this.score = -2;

    if (this.score !== 2)
      this.issues.push({
        id: uuid(),
        affects: this.affects,
        message:
          'You need to use a variety of sentece structures in your essay to get a higher score. Passive voice (e.g. “It is known that...“) seems to be missing. Also, passive voice sounds more formal.',
        shortMessage: 'Insufficient usage of passive voice',
        isInline: false,
        link: 'https://www.ef.com/wwen/english-resources/english-grammar/passive-voice/',
      });
  }
}
