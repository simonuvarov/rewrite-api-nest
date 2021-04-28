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
  shortMessage: string;
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

interface LTApiResponse {
  software: {
    name: string;
    version: string;
    buildDate: string;
    apiVersion: number;
    status: string;
    premium: boolean;
  };
  language: {
    name: string;
    code: string;
    detectedLanguage: {
      name: string;
      code: string;
    };
  };
  matches: [
    {
      message: string;
      shortMessage: string;
      offset: number;
      length: number;
      replacements: [
        {
          value: string;
        },
      ];
      context: {
        text: string;
        offset: number;
        length: number;
      };
      sentence: string;
      rule: {
        id: string;
        subId: string;
        description: string;
        urls: [
          {
            value: string;
          },
        ];
        issueType: string;
        category: {
          id: LTMatchCategory;
          name: string;
        };
      };
    },
  ];
}

@Injectable()
export class GrammarService {
  constructor(private httpService: HttpService) {}

  async check(text: string): Promise<GrammarCheckResult> {
    const result = await this.httpService
      .post<LTApiResponse>(
        `${process.env.LT_URL}/v2/check`,
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

    response.matches.map((match) => {
      issues.push({
        type: this.mapLTCategoryToGrammarIssueType(match.rule.category.id),
        message: match.message,
        shortMessage: match.shortMessage,
        offset: match.offset,
        length: match.length,
        replacements: match.replacements.map((r) => r.value),
      });
    });

    return issues;
  }
}
