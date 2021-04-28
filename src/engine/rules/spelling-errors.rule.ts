import { v4 as uuid } from 'uuid';
import { BaseRule, RuleProps } from '../base-rule.class';
import { CRITERIA_TYPE } from '../criteria-type.enum';
import { GrammarService, GRAMMAR_ISSUE_TYPE } from '../grammar.service';

export class SpellingErrorsRule extends BaseRule {
  get affects(): CRITERIA_TYPE {
    return CRITERIA_TYPE.LR;
  }
  constructor(private grammarService: GrammarService) {
    super();
  }

  private calculateSentenceOffset(sentence: string, text: string): number {
    return text.indexOf(sentence);
  }

  async _execute(props: RuleProps) {
    const sentences = props.parsedBody.sentences().out('array');

    // TODO: extract to rule engine
    const foundIssues = props.grammarCheckResult;
    const spellingIssues = foundIssues.filter(
      (issue) => issue.type === GRAMMAR_ISSUE_TYPE.SPELLING,
    );

    let sentencesWithErrorsCount = 0;

    sentences.forEach((sentence) => {
      const offset = this.calculateSentenceOffset(
        sentence,
        props.parsedBody.text(),
      );
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
        id: uuid(),
        offset: issue.offset,
        length: issue.length,
        message: issue.message,
        shortMessage: issue.shortMessage,
        affects: this.affects,
        isInline: true,
        replacements: issue.replacements.slice(0, 3),
        link: issue.link,
      }),
    );
  }
}
