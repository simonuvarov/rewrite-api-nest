import nlp from 'compromise';
import paragraphsPlugin from 'compromise-paragraphs';
import { v4 as uuid } from 'uuid';
import { CRITERIA_TYPE } from '../criteria-type.enum';
import { BaseRule } from './_base.rule';
import { ParsedPaper } from './_parsed-paper.class';

const CONCLUSION_DEVICES = ['to conclude', 'in conclusion', 'to sum up'];

export class ConclusionRule extends BaseRule {
  affects = CRITERIA_TYPE.TA;

  async _execute(parsedPaper: ParsedPaper) {
    //TODO: replace with service
    const _nlp = nlp.extend(paragraphsPlugin);
    const doc = _nlp(parsedPaper.parsedBody.text());

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
