import { v4 as uuid } from 'uuid';
import { BaseRule } from '../base-rule.entity';
import { CRITERIA_TYPE } from '../criteria-type.enum';
import { InlineIssue } from '../issue.type';
import { ParsedText } from '../nlp.service';

const INFORMAL_WORDS_AVOID_LIST = [
  'stuff',
  'awesome',
  'folks',
  'kid',
  'guy',
  'cop',
  'ok',
  'great',
  'useless',
  'stupid',
  'crazy',
  'dumb',
];

const INFORMAL_WORDS_AVOID_MATCH_STRING = `(${INFORMAL_WORDS_AVOID_LIST.join(
  '|',
)})`;

export class InformalWordsRule extends BaseRule {
  get affects(): CRITERIA_TYPE {
    return CRITERIA_TYPE.TA;
  }
  async _execute(paper: { question: string; body: ParsedText }) {
    const matches = paper.body.match(INFORMAL_WORDS_AVOID_MATCH_STRING);
    const matchesJson = matches.json({ offset: true });

    const issues: Array<InlineIssue> = matchesJson.map(
      (m) =>
        ({
          id: uuid(),
          isInline: true,
          affects: this.affects,
          message:
            'You are asked to write an academic essay. Avoid using informal words to make your language as formal and academic as possible.',
          shortMessage: `Informal word: ${m.terms[0].text}`,
          offset: m.terms[0].offset.start,
          length: m.terms[0].offset.length,
        } as InlineIssue),
    );

    this.issues.push(...issues);

    if (matchesJson) this.score = 2;
    else {
      this.score = -2;
    }
  }
}
