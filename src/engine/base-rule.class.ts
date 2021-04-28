import { Logger } from '@nestjs/common';
import { CRITERIA_TYPE } from './criteria-type.enum';
import { Issue } from './issue.type';
import { ParsedText } from './nlp.service';
import { RuleExecutionResult } from './rule-engine.service';

export abstract class BaseRule {
  abstract get affects(): CRITERIA_TYPE;
  protected score: number;
  protected issues: Array<Issue> = [];
  protected readonly logger = new Logger(this.constructor.name);

  public async execute(paper: {
    question: string;
    body: ParsedText;
  }): Promise<RuleExecutionResult> {
    const startTime = new Date();

    await this._execute(paper);

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

  protected abstract _execute(paper: {
    question: string;
    body: ParsedText;
  }): Promise<void>;
}
