import nlp from 'compromise';
import paragraphsPlugin from 'compromise-paragraphs';
import { v4 as uuid } from 'uuid';
import { BaseRule, RuleProps } from './_base.rule';
import { CRITERIA_TYPE } from '../criteria-type.enum';

const CONCLUSION_DEVICES = ['to conclude', 'in conclusion', 'to sum up'];

export class ConclusionRule extends BaseRule {
  get affects(): CRITERIA_TYPE {
    return CRITERIA_TYPE.TA;
  }
  async _execute(props: RuleProps) {
    //TODO: replace with service
    const _nlp = nlp.extend(paragraphsPlugin);
    const doc = _nlp(props.parsedBody.text());

    let conclusionFound = false;
    const lastParagraph = doc.paragraphs().last();
    for (const device of CONCLUSION_DEVICES) {
      if (lastParagraph.has(device)) {
        conclusionFound = true;
        break;
      }
    }

    if (conclusionFound) this.score = 2;
    else {
      this.score = -2;
      this.issues.push({
        id: uuid(),
        affects: this.affects,
        message:
          'You are required to write a conclusion in this type of essay.',
        shortMessage: 'Missing conclusion',
        isInline: false,
      });
    }
  }
}
