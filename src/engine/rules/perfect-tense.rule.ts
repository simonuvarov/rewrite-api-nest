import { v4 as uuid } from 'uuid';
import { NlpService, ParsedText } from '../nlp.service';
import { CRITERIA_TYPE, Rule } from '../rule-engine.service';

export class PerfectTenseRule extends Rule {
  constructor(private nlpService: NlpService) {
    super();
  }

  get affects(): CRITERIA_TYPE {
    return CRITERIA_TYPE.GR;
  }
  async _execute(paper: { question: string; body: ParsedText }) {
    const match = paper.body.match(
      '(will|shall)? (has|have|had) #Negative? #Adverb? #Verb+',
    );

    const matchCount = match.out('array').length;

    if (matchCount >= 1) this.score = 2;
    else {
      this.score = -2;
      this.issues.push({
        id: uuid(),
        affects: this.affects,
        message: 'You need to use perfect tense.',
        shortMessage: 'Perfect tense',
        isInline: false,
      });
    }
  }
}
