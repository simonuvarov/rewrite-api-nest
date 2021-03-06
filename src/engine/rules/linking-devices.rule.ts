import { v4 as uuid } from 'uuid';
import { CRITERIA_TYPE } from '../criteria-type.enum';
import { BaseRule } from './_base.rule';
import { ParsedPaper } from './_parsed-paper.class';

const LINKING_WORDS_LIST = [
  'accordingly',
  'additionally',
  'also',
  'although',
  'as a result',
  'besides',
  'by comparison',
  'by contrast',
  'consequently',
  'conversely',
  'finally',
  'first',
  'firstly',
  'for example',
  'for instance',
  'further',
  'furthermore',
  'hence',
  'however',
  'in addition',
  'in contrast',
  'in other words',
  'in particular',
  'initially',
  'instead',
  'last',
  'lastly',
  'likewise',
  'moreover',
  'nevertheless',
  'next',
  'nonetheless',
  'on the contrary',
  'on the other hand',
  'otherwise',
  'second',
  'secondly',
  'similarly',
  'subsequently',
  'such',
  'that is',
  'then',
  'thereafter',
  'therefore',
  'third',
  'thirdly',
  'this',
  'thus',
  'to begin',
];

const LINKING_WORDS_MATCH_STRING = `(${LINKING_WORDS_LIST.join('|')})`;

export class LinkingDevicesRule extends BaseRule {
  affects = CRITERIA_TYPE.CC;

  async _execute(parsedPaper: ParsedPaper) {
    const matches = parsedPaper.parsedBody.match(LINKING_WORDS_MATCH_STRING);
    const matchCount = matches.out('array').length;

    if (matchCount >= 6) this.score = 2;
    else if (matchCount >= 4) this.score = 1;
    else if (matchCount >= 2) this.score = 0;
    else if (matchCount === 1) this.score = -1;
    else this.score = -2;
    if (this.score !== 2) {
      this.issues.push({
        id: uuid(),
        affects: this.affects,
        message:
          'You need to use cohesive devices to get a good score. Usage of such words and phrases will enable you to establish clear connections between your ideas.',
        shortMessage: 'Insufficient usage of linking words',
        isInline: false,
      });
    }
  }
}
