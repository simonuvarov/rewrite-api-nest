import { GrammarService, GRAMMAR_ISSUE_TYPE } from '../grammar.service';
import { NlpService } from '../nlp.service';
import { CRITERIA_TYPE, Rule } from '../rule-engine.service';

export class SpellingErrorsRule extends Rule {
  get affects(): CRITERIA_TYPE {
    return CRITERIA_TYPE.LR;
  }
  constructor(
    private grammarService: GrammarService,
    private nlpService: NlpService,
  ) {
    super();
  }

  private calculateSentenceOffset(sentence: string, text: string): number {
    return text.indexOf(sentence);
  }

  async _execute(paper: { question: string; body: string }) {
    const doc = await this.nlpService.parse(paper.body);
    const sentences = doc.sentences().out('array');

    // TODO: extract to rule engine
    const foundIssues = await this.grammarService.check(paper.body);
    const spellingIssues = foundIssues.filter(
      (issue) => issue.type === GRAMMAR_ISSUE_TYPE.SPELLING,
    );

    let sentencesWithErrorsCount = 0;

    sentences.forEach((sentence) => {
      const offset = this.calculateSentenceOffset(sentence, paper.body);
      const length = sentence.length;
      const sentenceEnd = offset + length;

      let errorFound = false;
      spellingIssues.forEach((issue) => {
        const issueEnd = issue.offset + issue.length;
        if (issue.offset >= offset && issueEnd <= sentenceEnd) {
          errorFound = true;
        }
      });

      if (errorFound) sentencesWithErrorsCount = sentencesWithErrorsCount + 1;
    });

    const sentencesWithoutErrorsCount =
      sentences.length - sentencesWithErrorsCount;
    const ratio = sentencesWithoutErrorsCount / sentences.length;

    if (ratio >= 0.9) {
      this.score = 2;
    } else if (ratio >= 0.8) {
      this.score = 1;
    } else if (ratio >= 0.7) {
      this.score = 0;
    } else if (ratio >= 0.6) {
      this.score = -1;
    } else {
      this.score = -2;
    }

    spellingIssues.map((issue) =>
      this.issues.push({
        offset: issue.offset,
        length: issue.length,
        message: issue.message,
        shortMessage: issue.shortMessage,
        affects: this.affects,
        isInline: true,
      }),
    );
  }
}
