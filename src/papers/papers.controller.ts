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
import { JwtAuthGuard } from 'src/identity/jwt-auth.guard';
import { CreatePaperDto } from './dto/create-paper.dto';
import { UpdatePaperDto } from './dto/update-paper.dto';
import { GrammarService } from './grammar.service';
import { PapersService } from './papers.service';
import { RuleEngineService } from './rule-engine.service';
import { ConclusionRule } from './rules/conclusion.rule';
import { ErrorFreeSentecesRule } from './rules/error-free-sentences.rule';
import { LinkingDevicesRule } from './rules/linking-devices.rule';
import { ParagraphCountRule } from './rules/paragraph-count.rule';
import { PassiveVoiceRule } from './rules/passive-voice.rule';
import { PerfectTenseRule } from './rules/perfect-tense.rule';
import { SpellingErrorsRule } from './rules/spelling-errors.rule';
import { WordCountRule } from './rules/word-count.rule';

@Controller('papers')
export class PapersController {
  constructor(
    private readonly papersService: PapersService,
    private grammarService: GrammarService,
    private engine: RuleEngineService,
  ) {}

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
      this.engine.setRules([
        new ErrorFreeSentecesRule(this.grammarService),
        new ConclusionRule(),
        new WordCountRule(),
        new ParagraphCountRule(),
        new LinkingDevicesRule(),
        new PassiveVoiceRule(),
        new PerfectTenseRule(),
        new SpellingErrorsRule(this.grammarService),
      ]);

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
