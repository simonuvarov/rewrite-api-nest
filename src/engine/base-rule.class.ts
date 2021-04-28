import { Logger } from '@nestjs/common';
import { CRITERIA_TYPE } from './criteria-type.enum';
import { GrammarCheckResult } from './grammar.service';
import { Issue } from './issue.type';
import { ParsedText } from './nlp.service';
import { RuleExecutionResult } from './rule-engine.service';

export interface RuleProps {
  question: string;
  parsedBody: ParsedText;
  grammarCheckResult: GrammarCheckResult;
}

export abstract class BaseRule {
  abstract get affects(): CRITERIA_TYPE;
  protected score: number;
  protected issues: Array<Issue> = [];
  protected readonly logger = new Logger(this.constructor.name);

  public async execute(props: RuleProps): Promise<RuleExecutionResult> {
    const startTime = new Date();

    await this._execute(props);

    const endTime = new Date();
    this.logger.debug(`Finished running in ${+endTime - +startTime}ms`);

    return {
      affects: this.affects,
      score: this.score,
      issues: this.issues,
      name: this.name,
    };
  }

  get name() {
    return this.constructor.name;
  }

  protected abstract _execute(props: RuleProps): Promise<void>;
}
