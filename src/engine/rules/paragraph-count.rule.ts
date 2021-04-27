import { v4 as uuid } from 'uuid';
import { ParsedText } from '../nlp.service';
import { CRITERIA_TYPE, Rule } from '../rule-engine.service';

export class ParagraphCountRule extends Rule {
  get affects(): CRITERIA_TYPE {
    return CRITERIA_TYPE.CC;
  }
  async _execute(paper: { question: string; body: ParsedText }) {
    const paragraphCount = paper.body.text().replace(/\n$/gm, '').split(/\n/)
      .length;

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
