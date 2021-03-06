import { v4 as uuid } from 'uuid';
import { CRITERIA_TYPE } from '../criteria-type.enum';
import { InlineIssue } from '../issue.type';
import { BaseRule } from './_base.rule';
import { ParsedPaper } from './_parsed-paper.class';

interface RULE {
  replacements?: Array<string>;
}

interface WORD_RULE_DICT {
  [key: string]: RULE;
}

const EASy_WORDS_LIST: WORD_RULE_DICT = {
  good: { replacements: ['great'] },
  bad: { replacements: ['awful', 'negative'] },
  big: { replacements: ['enourmous'] },
  easy: { replacements: ['obvious'] },
  hard: { replacements: ['impossible'] },
  give: { replacements: ['provide'] },
  important: { replacements: ['crucial'] },
};

const EASY_WORDS_MATCH_STRING = `(${Object.keys(EASy_WORDS_LIST).join('|')})`;

export class EasyWordsRule extends BaseRule {
  affects = CRITERIA_TYPE.LR;

  async _execute(parsedPaper: ParsedPaper) {
    const matches = parsedPaper.parsedBody.match(EASY_WORDS_MATCH_STRING);
    const matchesJson = matches.json({ offset: true });

    const issues: Array<InlineIssue> = matchesJson.map((m) => {
      const issue: InlineIssue = {
        id: uuid(),
        isInline: true,
        affects: this.affects,
        message: `${m.terms[0].text} is considered to be an "easy" word. Try using another word to demonstrate your vocabulary.`,
        shortMessage: `Easy word: ${m.terms[0].text}`,
        offset: m.terms[0].offset.start,
        length: m.terms[0].offset.length,
      };
      return issue;
    });

    this.issues.push(...issues);

    if (matchesJson.lenght <= 2) this.score = 2;
    else {
      this.score = -2;
    }
  }
}
