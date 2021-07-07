import { GrammarCheckResult } from '../grammar.service';
import { ParsedText } from '../nlp.service';

interface ParsedPaperProps {
  question: string;
  body: string;
  parsedBody: ParsedText;
  grammarCheckResult: GrammarCheckResult;
}

export class ParsedPaper {
  readonly question: string;
  readonly body: string;
  readonly parsedBody: ParsedText;
  readonly grammarCheckResult: GrammarCheckResult;

  constructor({
    question,
    body,
    parsedBody,
    grammarCheckResult,
  }: ParsedPaperProps) {
    this.question = question;
    this.body = body;
    this.parsedBody = parsedBody;
    this.grammarCheckResult = grammarCheckResult;
  }
}
