import { NlpService } from '../nlp.service';
import { CRITERIA_TYPE, Rule } from '../rule-engine.service';

export class PassiveVoiceRule extends Rule {
  constructor(private nlpService: NlpService) {
    super();
  }
  private async countPassiveVoice(text: string): Promise<number> {
    const doc = await this.nlpService.parse(text);

    const match = doc.match('#Verb * #Participle');

    return match.out('array').length;
  }

  get affects(): CRITERIA_TYPE {
    return CRITERIA_TYPE.GR;
  }
  async _execute(paper: { question: string; body: string }) {
    const matchCount = await this.countPassiveVoice(paper.body);

    if (matchCount >= 1) this.score = 2;
    else {
      this.score = -2;
      this.issues.push({
        affects: this.affects,
        message: 'You need to use passive voice.',
        shortMessage: 'Passive voice',
        isInline: false,
      });
    }
  }
}
