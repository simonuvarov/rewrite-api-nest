import { v4 as uuid } from 'uuid';
import { CRITERIA_TYPE } from '../criteria-type.enum';
import { BaseRule } from './_base.rule';
import { ParsedPaper } from './_parsed-paper.class';

export class WordCountRule extends BaseRule {
  affects = CRITERIA_TYPE.TA;

  async _execute(parsedPaper: ParsedPaper) {
    const wordCount = parsedPaper.parsedBody.wordCount();

    if (wordCount >= 250 && wordCount <= 350) {
      this.score = 2;
    } else if (wordCount > 350 && wordCount <= 500) {
      this.score = 1;
    } else {
      this.score = -2;
    }

    if (this.score !== 2)
      this.issues.push({
        id: uuid(),
        affects: this.affects,
        message:
          'IELTS asks you to write at least 250 for Task 2. Aim for about 270 – 290 words. This will mean you are safely over the word limit but without adding too much irrelevant information. However, don’t write too much. Aim for quality rather than quantity. You will not get additional points for additional words. ',
        shortMessage: 'Insufficient word count',
        isInline: false,
        link: 'https://ieltsliz.com/how-many-words-ielts-writing/',
      });
  }
}
