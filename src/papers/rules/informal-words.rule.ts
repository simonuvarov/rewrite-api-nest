import nlp from 'compromise';
import { CRITERIA_TYPE, InlineIssue, Rule } from '../rule-engine.service';

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

export class InformalWordsRule extends Rule {
  get affects(): CRITERIA_TYPE {
    return CRITERIA_TYPE.TA;
  }
  async _execute(paper: { question: string; body: string }) {
    const doc = nlp(paper.body);

    const matches = doc.match(INFORMAL_WORDS_AVOID_MATCH_STRING);
    const matchesJson = matches.json({ offset: true });

    const issues: Array<InlineIssue> = matchesJson.map(
      (m) =>
        ({
          isInline: true,
          affects: this.affects,
          message:
            'You are asked to write an academic essay. Avoid using informal words to make your language as formal and academic as possible.',
          shortMessage: `Informal word: ${m.terms[0].text}`,
          offset: m.offset.start,
          length: m.offset.length,
        } as InlineIssue),
    );

    this.issues.push(...issues);

    if (matchesJson) this.score = 2;
    else {
      this.score = -2;
    }
  }
}
