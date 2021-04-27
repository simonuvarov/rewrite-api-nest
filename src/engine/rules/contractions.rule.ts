import { v4 as uuid } from 'uuid';
import { NlpService, ParsedText } from '../nlp.service';
import { CRITERIA_TYPE, Rule } from '../rule-engine.service';

export class ContractionsRule extends Rule {
  constructor(private nlpService: NlpService) {
    super();
  }

  get affects(): CRITERIA_TYPE {
    return CRITERIA_TYPE.TA;
  }
  async _execute(paper: { question: string; body: ParsedText }) {
    const contractions = paper.body.contractions();

    contractions.forEach((c) => {
      this.issues.push({
        id: uuid(),
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
