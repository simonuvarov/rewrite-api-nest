import { v4 as uuid } from 'uuid';
import { CRITERIA_TYPE } from '../criteria-type.enum';
import { GRAMMAR_ISSUE_TYPE } from '../grammar.service';
import { BaseRule } from './_base.rule';
import { ParsedPaper } from './_parsed-paper.class';

export class GrammarErrorsRule extends BaseRule {
  affects = CRITERIA_TYPE.GR;

  constructor() {
    super();
  }

  private calculateSentenceOffset(sentence: string, text: string): number {
    return text.indexOf(sentence);
  }

  async _execute(parsedPaper: ParsedPaper) {
    const sentences = parsedPaper.parsedBody.sentences().out('array');

    const foundIssues = parsedPaper.grammarCheckResult;
    const grammarIssues = foundIssues.filter(
      (issue) =>
        issue.type === GRAMMAR_ISSUE_TYPE.GRAMMAR ||
        issue.type === GRAMMAR_ISSUE_TYPE.PUNCTUATION,
    );

    let sentencesWithErrorsCount = 0;

    sentences.forEach((sentence) => {
      const offset = this.calculateSentenceOffset(
        sentence,
        parsedPaper.parsedBody.text(),
      );
      const length = sentence.length;
      const sentenceEnd = offset + length;

      let errorFound = false;
      grammarIssues.forEach((issue) => {
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

    if (ratio === 1) {
      this.score = 2;
    } else if (ratio >= 11 / 13) {
      this.score = 1;
    } else if (ratio >= 9 / 13) {
      this.score = 0;
    } else if (ratio >= 7 / 13) {
      this.score = -1;
    } else {
      this.score = -2;
    }

    grammarIssues.map((issue) =>
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
