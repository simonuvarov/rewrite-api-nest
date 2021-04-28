import { Injectable, Logger, Scope } from '@nestjs/common';
import { BaseRule } from './rules/_base.rule';
import { CRITERIA_TYPE } from './criteria-type.enum';
import { GrammarService } from './grammar.service';
import { Issue } from './issue.type';
import { NlpService } from './nlp.service';

export interface RuleExecutionResult {
  affects: CRITERIA_TYPE;
  score: number;
  issues: Array<Issue>;
  name: string;
}

@Injectable({ scope: Scope.REQUEST })
export class RuleEngineService {
  private rules: Array<BaseRule>;
  private results: Array<RuleExecutionResult>;
  private readonly logger = new Logger(RuleEngineService.name);

  constructor(
    private nlpService: NlpService,
    private grammarService: GrammarService,
  ) {
    this.rules = [];
    this.results = [];
  }

  public setRules(rules: Array<BaseRule>) {
    this.rules = rules;
  }

  private sortIssues(issues: Array<Issue>): Array<Issue> {
    const sortedIssues = issues.sort((a, b) => {
      if (!a.isInline && b.isInline) return -1;
      if (a.isInline && !b.isInline) return 1;
      if (!a.isInline && !b.isInline) {
        if (a.affects < b.affects) return -1;
        if (a.affects > b.affects) return 1;
      }
      if (a.isInline && b.isInline) return a.offset - b.offset;
    });
    return sortedIssues;
  }

  private calculateBandForCriteria(criteria: CRITERIA_TYPE) {
    if (this.results.length === 0)
      throw new Error('You need to run the rules first');

    const relevantResults = this.results.filter((r) => r.affects === criteria);
    if (relevantResults.length === 0) return 0;

    const score = relevantResults.reduce((score, r) => score + r.score, 0);

    const ruleCount = this.rules.filter((r) => r.affects === criteria).length;

    const BASE_BAND = 4.5;
    const multiplier = this.calculateMultiplier(score, ruleCount);

    const band = Math.floor(BASE_BAND * multiplier);

    return band;
  }

  private calculateMultiplier(score: number, ruleCount: number) {
    const MAX_SCORE = 2;
    const multiplier = 1 + score / MAX_SCORE / ruleCount; // max multipler is 2 to get to band 9 which is 4.5 * 2
    return multiplier;
  }

  get bands() {
    if (this.results.length === 0)
      throw new Error('You need to run the rules first');

    const taBand = this.calculateBandForCriteria(CRITERIA_TYPE.TA);
    const ccBand = this.calculateBandForCriteria(CRITERIA_TYPE.CC);
    const lrBand = this.calculateBandForCriteria(CRITERIA_TYPE.LR);
    const grBand = this.calculateBandForCriteria(CRITERIA_TYPE.GR);

    const overallBand = this.roundToNearestHalf(
      (taBand + ccBand + lrBand + grBand) / 4,
    );

    return {
      overall: overallBand,
      ta: taBand,
      cc: ccBand,
      lr: lrBand,
      gr: grBand,
    };
  }

  get issues() {
    if (this.results.length === 0)
      throw new Error('You need to run the rules first');

    const issues = this.results.flatMap((r) => r.issues);
    return this.sortIssues(issues);
  }

  public async run(paper: { question: string; body: string }) {
    const startTime = new Date();

    const parsedBody = await this.nlpService.parse(paper.body);
    const grammarCheckResult = await this.grammarService.check(paper.body);

    this.results = await Promise.all(
      this.rules.map((rule) =>
        rule.execute({
          question: paper.question,
          parsedBody,
          grammarCheckResult,
        }),
      ),
    );
    const endTime = new Date();

    this.logger.debug(`Finished running rules in ${+endTime - +startTime}ms`);
  }

  private roundToNearestHalf(n: number): number {
    return Math.round(n * 2) / 2;
  }
}
