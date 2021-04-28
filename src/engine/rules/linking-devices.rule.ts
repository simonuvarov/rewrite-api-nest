import { v4 as uuid } from 'uuid';
import { BaseRule, RuleProps } from '../base-rule.class';
import { CRITERIA_TYPE } from '../criteria-type.enum';

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
  get affects(): CRITERIA_TYPE {
    return CRITERIA_TYPE.CC;
  }
  async _execute(props: RuleProps) {
    const matches = props.parsedBody.match(LINKING_WORDS_MATCH_STRING);
    const matchCount = matches.out('array').length;

    if (matchCount > 2) this.score = 2;
    else {
      this.score = -2;
      this.issues.push({
        id: uuid(),
        affects: this.affects,
        message: 'You need to use cohesive devices to get good score.',
        shortMessage: 'Linking words',
        isInline: false,
      });
    }
  }
}
