import { HttpService, Injectable } from '@nestjs/common';
import qs from 'qs';

export type LTMatchCategory =
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

export interface LTApiResponse {
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
export class LanguageToolService {
  constructor(private httpService: HttpService) {}

  async check(text: string): Promise<LTApiResponse> {
    const result = await this.httpService
      .post<LTApiResponse>(
        `${process.env.LT_URL}/v2/check`,
        qs.stringify({ text: text, language: 'en-US' }),
      )
      .toPromise();

    return result.data;
  }
}
