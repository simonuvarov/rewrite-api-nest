import { NlpService } from '../nlp.service';
import { CRITERIA_TYPE, Rule } from '../rule-engine.service';

export class PerfectTenseRule extends Rule {
  constructor(private nlpService: NlpService) {
    super();
  }

  private async countPerfectTense(text: string): Promise<number> {
    const doc = await this.nlpService.parse(text);
    const match = doc.match(
      '(will|shall)? (has|have|had) #Negative? #Adverb? #Verb+',
    );
    return match.out('array').length;
  }

  get affects(): CRITERIA_TYPE {
    return CRITERIA_TYPE.GR;
  }
  async _execute(paper: { question: string; body: string }) {
    const matchCount = await this.countPerfectTense(paper.body);

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
