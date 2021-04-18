import { CRITERIA_TYPE, Rule } from '../rule-engine.service';

export class ParagraphCountRule extends Rule {
  get affects(): CRITERIA_TYPE {
    return CRITERIA_TYPE.CC;
  }
  async _execute(paper: { question: string; body: string }) {
    const paragraphCount = paper.body.replace(/\n$/gm, '').split(/\n/).length;

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
        message:
          "Generally it's recommended to use 4 to 5 paragraphs in your essay",
        shortMessage: 'Paragraph count',
        isInline: false,
        affects: this.affects,
      });
  }
}
