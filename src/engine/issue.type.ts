import { CRITERIA_TYPE } from './criteria-type.enum';

export interface InlineIssue {
  id: string;
  message: string;
  shortMessage: string;
  offset: number;
  length: number;
  replacements?: Array<string>;
  affects: CRITERIA_TYPE;
  isInline: true;
  link?: string;
}

export interface NotInlineIssue {
  id: string;
  message: string;
  shortMessage: string;
  affects: CRITERIA_TYPE;
  isInline: false;
  link?: string;
}

export type Issue = InlineIssue | NotInlineIssue;
