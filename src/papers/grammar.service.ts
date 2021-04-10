import { HttpService, Injectable } from '@nestjs/common';
import formurlencoded from 'form-urlencoded';

export enum GRAMMAR_ISSUE_TYPE {
  GRAMMAR = 'grammar',
  SPELLING = 'spelling',
  PUNCTUATION = 'punctuation',
  STYLE = 'style',
}

export type GrammarIssue = {
  type: GRAMMAR_ISSUE_TYPE;
  message: string;
  offset: number;
  length: number;
  replacements: Array<string>;
};

type GrammarCheckResult = Array<GrammarIssue>;

/**
 * LanguageTool Types
 */

type LTMatchCategory =
  | 'CASING'
  | 'COMPOUNDING'
  | 'GRAMMAR'
  | 'TYPOS'
  | 'PUNCTUATION'
  | 'TYPOGRAPHY'
  | 'CONFUSED_WORDS'
  | 'REPETITIONS'
  | 'REDUNDANCY'
  | 'STYLE'
  | 'GENDER_NEUTRALITY'
  | 'SEMANTICS'
  | 'COLLOQUIALISMS'
  | 'REGIONALISMS'
  | 'FALSE_FRIENDS'
  | 'MISC';

interface LTFoundMatch {
  message: string;
  shortMessage: string;
  replacements: [{ value: string }];
  offset: number;
  length: number;
  rule: { category: { id: LTMatchCategory; name: string } };
}

interface LTApiResponse {
  matches: [];
}

@Injectable()
export class GrammarService {
  constructor(private httpService: HttpService) {}

  async check(text: string): Promise<GrammarCheckResult> {
    const result = await this.httpService
      .post<LTApiResponse>(
        'http://localhost:8010/v2/check',
        formurlencoded({ text: text, language: 'en-US' }),
      )
      .toPromise();

    return this.mapApiResponseToIssues(result.data);
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

    response.matches.map((match: LTFoundMatch) => {
      issues.push({
        type: this.mapLTCategoryToGrammarIssueType(match.rule.category.id),
        message: match.message,
        offset: match.offset,
        length: match.length,
        replacements: match.replacements.map((r) => r.value),
      });
    });

    return issues;
  }
}
