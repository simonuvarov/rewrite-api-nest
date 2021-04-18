import { Injectable, Logger } from '@nestjs/common';

export interface Issue {
  message: string;
  shortMessage: string;
  offset: number;
  length: number;
  replacements?: Array<string>;
  affects: CRITERIA_TYPE;
  isInline: boolean;
  link?: string;
}

export interface RuleExecutionResult {
  affects: CRITERIA_TYPE;
  score: number;
  issues: Array<Issue>;
  name: string;
}

export enum CRITERIA_TYPE {
  TA = 'Task Achievement',
  CC = 'Coherence and Cohesion',
  GR = 'Grammatical Range and Accuracy',
  LR = 'Lexical Resource',
}

export abstract class Rule {
  abstract get affects(): CRITERIA_TYPE;
  protected score: number;
  protected issues: Array<Issue> = [];

  public async execute(paper: {
    question: string;
    body: string;
  }): Promise<RuleExecutionResult> {
    await this._execute(paper);
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
    body: string;
  }): Promise<void>;
}

@Injectable()
export class RuleEngineService {
  private rules: Array<Rule>;
  private results: Array<RuleExecutionResult>;
  private readonly logger = new Logger(RuleEngineService.name);

  constructor() {
    this.rules = [];
    this.results = [];
  }

  public setRules(rules: Array<Rule>) {
    this.rules = rules;
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

    return this.results.flatMap((r) => r.issues);
  }

  public async run(paper: { question: string; body: string }) {
    this.logger.debug(
      `RuleEngine is about to run with ${this.rules.length} rule(s)`,
    );

    this.results = await Promise.all(
      this.rules.map((rule) => rule.execute(paper)),
    );

    this.logger.debug('RuleEngine finished running');
  }

  private roundToNearestHalf(n: number): number {
    return Math.round(n * 2) / 2;
  }
}
