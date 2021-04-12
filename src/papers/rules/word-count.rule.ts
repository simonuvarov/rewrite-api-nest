import nlp from 'compromise';
import { CRITERIA_TYPE, Rule } from '../rule-engine.service';

export class WordCountRule extends Rule {
  get affects(): CRITERIA_TYPE {
    return CRITERIA_TYPE.TA;
  }
  async _execute(paper: { question: string; body: string }) {
    const wordCount = nlp(paper.body).wordCount();

    if (wordCount >= 250 && wordCount <= 350) {
      this.score = 2;
    } else if (wordCount > 350 && wordCount <= 500) {
      this.score = 1;
    } else {
      this.score = -2;
    }

    if (this.score !== 2)
      this.issues.push({
        affects: this.affects,
        message: 'You need to write at least 250 words',
        shortMessage: 'Word count',
        isInline: false,
        offset: 0,
        length: 0,
      });
  }
}
