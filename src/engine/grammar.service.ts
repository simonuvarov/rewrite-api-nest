import { Injectable } from '@nestjs/common';
import {
  LanguageToolService,
  LTApiResponse,
  LTMatchCategory,
} from './language-tool.service';

export enum GRAMMAR_ISSUE_TYPE {
  GRAMMAR = 'grammar',
  SPELLING = 'spelling',
  PUNCTUATION = 'punctuation',
  STYLE = 'style',
}

export type GrammarIssue = {
  type: GRAMMAR_ISSUE_TYPE;
  message: string;
  shortMessage: string;
  offset: number;
  length: number;
  replacements: Array<string>;
  link?: string;
};

type GrammarCheckResult = Array<GrammarIssue>;

@Injectable()
export class GrammarService {
  constructor(private languageToolService: LanguageToolService) {}

  async check(text: string): Promise<GrammarCheckResult> {
    const result = await this.languageToolService.check(text);
    return this.mapApiResponseToIssues(result);
  }

  private mapLTCategoryToGrammarIssueType(
    category: LTMatchCategory,
  ): GRAMMAR_ISSUE_TYPE {
    /** Spelling */
    if (
      category === 'TYPOS' ||
      category === 'FALSE_FRIENDS' ||
      category === 'TYPOGRAPHY' ||
      category === 'REPETITIONS' ||
      category === 'CONFUSED_WORDS' ||
      category === 'COMPOUNDING' ||
      category === 'CASING'
    )
      return GRAMMAR_ISSUE_TYPE.SPELLING;

    /** Grammar */
    if (category === 'GRAMMAR') return GRAMMAR_ISSUE_TYPE.GRAMMAR;

    /** Style */
    if (category === 'STYLE') return GRAMMAR_ISSUE_TYPE.STYLE;
    else if (category === 'GENDER_NEUTRALITY') return GRAMMAR_ISSUE_TYPE.STYLE;

    /** Punctuation */
    if (category === 'PUNCTUATION') return GRAMMAR_ISSUE_TYPE.PUNCTUATION;

    /**
     * Default to SPELLING
     */
    return GRAMMAR_ISSUE_TYPE.SPELLING;
  }

  private mapApiResponseToIssues(response: LTApiResponse): Array<GrammarIssue> {
    if (!response.matches) return [];

    const issues: Array<GrammarIssue> = [];

    response.matches.map((match) => {
      issues.push({
        type: this.mapLTCategoryToGrammarIssueType(match.rule.category.id),
        message: match.message,
        shortMessage: match.shortMessage,
        offset: match.offset,
        length: match.length,
        replacements: match.replacements.map((r) => r.value),
        link: match.rule.urls ? match.rule.urls[0].value : undefined,
      });
    });

    return issues;
  }
}
