import { v4 as uuid } from 'uuid';
import { ParsedText } from '../nlp.service';
import { CRITERIA_TYPE, Rule } from '../rule-engine.service';

export class PassiveVoiceRule extends Rule {
  get affects(): CRITERIA_TYPE {
    return CRITERIA_TYPE.GR;
  }

  async _execute(paper: { question: string; body: ParsedText }) {
    const match = paper.body.match('#Verb * #Participle');
    const matchCount = match.out('array').length;

    if (matchCount >= 1) this.score = 2;
    else {
      this.score = -2;
      this.issues.push({
        id: uuid(),
        affects: this.affects,
        message:
          'You need to use a variety of sentece structures in your essay to get a higher score. Passive voice (e.g. “It is known that...“) seems to be missing. Also, passive voice sounds more formal.',
        shortMessage: 'Passive voice',
        isInline: false,
      });
    }
  }
}
