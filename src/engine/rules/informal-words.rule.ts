import { v4 as uuid } from 'uuid';
import { BaseRule, RuleProps } from '../base-rule.class';
import { CRITERIA_TYPE } from '../criteria-type.enum';
import { InlineIssue } from '../issue.type';

interface RULE {
  replacements?: Array<string>;
}

interface WORD_RULE_DICT {
  [key: string]: RULE;
}

const INFORMAL_WORDS_AVOID_LIST: WORD_RULE_DICT = {
  stuff: {},
  awesome: { replacements: ['great'] },
  folks: {},
  kid: {},
  guy: {},
  cop: { replacements: ['policeman'] },
  ok: {},
  great: {},
  useless: {},
  stupid: {},
  crazy: {},
  dumb: {},
};

const INFORMAL_WORDS_AVOID_MATCH_STRING = `(${Object.keys(
  INFORMAL_WORDS_AVOID_LIST,
).join('|')})`;

export class InformalWordsRule extends BaseRule {
  get affects(): CRITERIA_TYPE {
    return CRITERIA_TYPE.TA;
  }
  async _execute(props: RuleProps) {
    const matches = props.parsedBody.match(INFORMAL_WORDS_AVOID_MATCH_STRING);
    const matchesJson = matches.json({ offset: true });

    const issues: Array<InlineIssue> = matchesJson.map((m) => {
      const issue: InlineIssue = {
        id: uuid(),
        isInline: true,
        affects: this.affects,
        message: `You are asked to write an academic essay. Avoid using informal words such as ${m.terms[0].text} to make your language as formal and academic as possible.`,
        shortMessage: `Informal word: ${m.terms[0].text}`,
        offset: m.terms[0].offset.start,
        length: m.terms[0].offset.length,
      };
      return issue;
    });

    this.issues.push(...issues);

    if (matchesJson) this.score = 2;
    else {
      this.score = -2;
    }
  }
}
