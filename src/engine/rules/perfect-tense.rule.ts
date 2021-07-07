import { v4 as uuid } from 'uuid';
import { CRITERIA_TYPE } from '../criteria-type.enum';
import { BaseRule } from './_base.rule';
import { ParsedPaper } from './_parsed-paper.class';

export class PerfectTenseRule extends BaseRule {
  get affects(): CRITERIA_TYPE {
    return CRITERIA_TYPE.GR;
  }
  async _execute(parsedPaper: ParsedPaper) {
    const match = parsedPaper.parsedBody.match(
      '(will|shall)? (has|have|had) #Negative? #Adverb? #Verb+',
    );

    const matchCount = match.out('array').length;

    if (matchCount >= 2) this.score = 2;
    else if (matchCount === 1) this.score = 1;
    else this.score = -2;

    if (this.score !== 2)
      this.issues.push({
        id: uuid(),
        affects: this.affects,
        message:
          'You need to use a variety of tenses in your essay to get a higher score. Perfect tense usage (e.g. “I have done“) seems to be missing.',
        shortMessage: 'Insufficient usage of the perfect tense',
        isInline: false,
        link: 'https://www.ef.com/wwen/english-resources/english-grammar/present-perfect/',
      });
  }
}
