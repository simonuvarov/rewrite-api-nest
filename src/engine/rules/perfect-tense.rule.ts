import { v4 as uuid } from 'uuid';
import { BaseRule } from '../base-rule.entity';
import { CRITERIA_TYPE } from '../criteria-type.enum';
import { ParsedText } from '../nlp.service';

export class PerfectTenseRule extends BaseRule {
  get affects(): CRITERIA_TYPE {
    return CRITERIA_TYPE.GR;
  }
  async _execute(paper: { question: string; body: ParsedText }) {
    const match = paper.body.match(
      '(will|shall)? (has|have|had) #Negative? #Adverb? #Verb+',
    );

    const matchCount = match.out('array').length;

    if (matchCount >= 1) this.score = 2;
    else {
      this.score = -2;
      this.issues.push({
        id: uuid(),
        affects: this.affects,
        message:
          'You need to use a variety of tenses in your essay to get a higher score. Perfect tense usage (e.g. “I have done“) seems to be missing.',
        shortMessage: 'Did you use perfect tense?',
        isInline: false,
      });
    }
  }
}
