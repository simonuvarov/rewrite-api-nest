import nlp from 'compromise';
import { CRITERIA_TYPE, Rule } from '../rule-engine.service';

export class PerfectTenseRule extends Rule {
  private countPerfectTense(text: string): number {
    const doc = nlp(text);
    const match = doc.match(
      '(will|shall)? (has|have|had) #Negative? #Adverb? #Verb+',
    );
    return match.out('array').length;
  }

  get affects(): CRITERIA_TYPE {
    return CRITERIA_TYPE.GR;
  }
  async _execute(paper: { question: string; body: string }) {
    const matchCount = this.countPerfectTense(paper.body);

    if (matchCount >= 1) this.score = 2;
    else {
      this.score = -2;
      this.issues.push({
        affects: this.affects,
        message: 'You need to use perfect tense.',
        shortMessage: 'Perfect tense',
        isInline: false,
      });
    }
  }
}
