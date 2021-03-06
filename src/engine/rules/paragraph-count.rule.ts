import { v4 as uuid } from 'uuid';
import { CRITERIA_TYPE } from '../criteria-type.enum';
import { BaseRule } from './_base.rule';
import { ParsedPaper } from './_parsed-paper.class';

export class ParagraphCountRule extends BaseRule {
  affects = CRITERIA_TYPE.CC;

  async _execute(parsedPaper: ParsedPaper) {
    const paragraphCount = parsedPaper.parsedBody
      .text()
      .replace(/\n$/gm, '')
      .split(/\n/).length;

    if (paragraphCount >= 4 && paragraphCount <= 5) {
      this.score = 2;
    } else if (paragraphCount === 6) {
      this.score = 1;
    } else if (paragraphCount >= 2 && paragraphCount < 4) {
      this.score = 0;
    } else {
      this.score = -2;
    }

    if (this.score !== 2)
      this.issues.push({
        id: uuid(),
        message:
          "Generally it's recommended to use four to five paragraphs in your essay. One paragraph for an introduction, one for conclusion and two or three body paragraphs. In most cases such a number of body paragraphs is sufficient to develop your ideas.",
        shortMessage: 'Insufficient paragraph count',
        isInline: false,
        affects: this.affects,
        link: 'https://ieltsliz.com/how-many-paragraphs-for-an-ielts-essay/',
      });
  }
}
