import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { EasyWordsRule } from 'src/engine/rules/easy-words.rule';
import { JwtAuthGuard } from 'src/identity/jwt-auth.guard';
import { GrammarService } from '../engine/grammar.service';
import { NlpService } from '../engine/nlp.service';
import { RuleEngineService } from '../engine/rule-engine.service';
import { AcademicWordsRule } from '../engine/rules/academic-words.rule';
import { ConclusionRule } from '../engine/rules/conclusion.rule';
import { ContractionsRule } from '../engine/rules/contractions.rule';
import { GrammarErrorsRule } from '../engine/rules/grammar-errors.rule';
import { InformalWordsRule } from '../engine/rules/informal-words.rule';
import { LinkingDevicesRule } from '../engine/rules/linking-devices.rule';
import { ParagraphCountRule } from '../engine/rules/paragraph-count.rule';
import { PassiveVoiceRule } from '../engine/rules/passive-voice.rule';
import { PerfectTenseRule } from '../engine/rules/perfect-tense.rule';
import { SpellingErrorsRule } from '../engine/rules/spelling-errors.rule';
import { WordCountRule } from '../engine/rules/word-count.rule';
import { CreatePaperDto } from './dto/create-paper.dto';
import { UpdatePaperDto } from './dto/update-paper.dto';
import { PapersService } from './papers.service';

@Controller('papers')
export class PapersController {
  constructor(
    private readonly papersService: PapersService,
    private grammarService: GrammarService,
    private engine: RuleEngineService,
    private nlpService: NlpService,
  ) {
    this.engine.setRules([
      new GrammarErrorsRule(this.grammarService),
      new ConclusionRule(),
      new WordCountRule(),
      new ParagraphCountRule(),
      new LinkingDevicesRule(),
      new PassiveVoiceRule(),
      new PerfectTenseRule(),
      new SpellingErrorsRule(this.grammarService),
      new AcademicWordsRule(),
      new InformalWordsRule(),
      new ContractionsRule(),
      new EasyWordsRule(),
    ]);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPaperDto: CreatePaperDto, @Request() req: any) {
    const userId = req.user.id;
    return this.papersService.createPaper(createPaperDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req: any) {
    const userId = req.user.id;
    return await this.papersService.findAll({
      orderBy: {
        updatedAt: 'desc',
      },
      where: {
        authorId: userId,
        OR: {
          question: { not: '' },
          body: {
            not: '',
          },
        },
      },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.id;

    const paper = await this.papersService.findPaperById(id);
    if (paper && paper.authorId === userId)
      return this.papersService.findPaperById(id);

    throw new NotFoundException();
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePaperDto: UpdatePaperDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    const paper = await this.papersService.findPaperById(id);

    if (paper && paper.authorId === userId) {
      await this.engine.run(updatePaperDto);
      const bands = this.engine.bands;
      const issues = this.engine.issues;

      await this.papersService.update(id, {
        question: updatePaperDto.question,
        body: updatePaperDto.body,
        overallBand: bands.overall,
        taBand: bands.ta,
        ccBand: bands.cc,
        lrBand: bands.lr,
        grBand: bands.gr,
      });

      return { issues, bands };
    }
    throw new NotFoundException();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.id;

    const paper = await this.papersService.findPaperById(id);
    if (paper && paper.authorId === userId)
      return this.papersService.remove(id);

    throw new NotFoundException();
  }
}
