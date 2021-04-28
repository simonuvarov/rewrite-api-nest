import { v4 as uuid } from 'uuid';
import { BaseRule, RuleProps } from '../base-rule.class';
import { CRITERIA_TYPE } from '../criteria-type.enum';

export class ContractionsRule extends BaseRule {
  get affects(): CRITERIA_TYPE {
    return CRITERIA_TYPE.TA;
  }
  async _execute(props: RuleProps) {
    const contractions = props.parsedBody.contractions();

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
