import { Logger } from '@nestjs/common';
import { CRITERIA_TYPE } from '../criteria-type.enum';
import { Issue } from '../issue.type';
import { RuleExecutionResult } from '../rule-engine.service';
import { ParsedPaper } from './_parsed-paper.class';

export abstract class BaseRule {
  public abstract affects: CRITERIA_TYPE;
  protected score: number;
  protected issues: Array<Issue> = [];
  protected readonly logger = new Logger(this.constructor.name);

  get name() {
    return this.constructor.name;
  }

  protected abstract _execute(parsedPaper: ParsedPaper): Promise<void>;

  public async execute(parsedPaper: ParsedPaper): Promise<RuleExecutionResult> {
    const startTime = new Date();

    await this._execute(parsedPaper);

    const endTime = new Date();
    this.logger.debug(`Finished running in ${+endTime - +startTime}ms`);

    return {
      affects: this.affects,
      score: this.score,
      issues: this.issues,
      name: this.name,
    };
  }
}
