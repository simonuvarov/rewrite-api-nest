import nlp from 'compromise';
import paragraphsPlugin from 'compromise-paragraphs';
import { v4 as uuid } from 'uuid';
import { CRITERIA_TYPE, Rule } from '../rule-engine.service';

const CONCLUSION_DEVICES = ['to conclude', 'in conclusion', 'to sum up'];

export class ConclusionRule extends Rule {
  get affects(): CRITERIA_TYPE {
    return CRITERIA_TYPE.TA;
  }
  async _execute(paper: { question: string; body: string }) {
    //TODO: replace with service
    const _nlp = nlp.extend(paragraphsPlugin);
    const doc = _nlp(paper.body);

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
