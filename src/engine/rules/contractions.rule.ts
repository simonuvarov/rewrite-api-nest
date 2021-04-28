import { v4 as uuid } from 'uuid';
import { BaseRule } from '../base-rule.entity';
import { CRITERIA_TYPE } from '../criteria-type.enum';
import { ParsedText } from '../nlp.service';

export class ContractionsRule extends BaseRule {
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
