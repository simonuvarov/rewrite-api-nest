import { NlpService } from '../nlp.service';
import { CRITERIA_TYPE, Rule } from '../rule-engine.service';

export class ContractionsRule extends Rule {
  constructor(private nlpService: NlpService) {
    super();
  }

  get affects(): CRITERIA_TYPE {
    return CRITERIA_TYPE.TA;
  }
  async _execute(paper: { question: string; body: string }) {
    const doc = await this.nlpService.parse(paper.body);
    const contractions = doc.contractions();

    contractions.forEach((c) => {
      this.issues.push({
        message: 'It is recommended not to use contractions in your essays.',
        shortMessage: `Contraction: ${c.text()}`,
        offset: c.json({ offset: true })[0].offset.start,
        length: c.json({ offset: true })[0].offset.length,
        isInline: true,
        affects: this.affects,
      });
    });

    if (this.issues.length <= 2) this.score = 2;
    else this.score = -1;
  }
}
