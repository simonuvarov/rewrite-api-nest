import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EasyWordsRule } from 'src/engine/rules/easy-words.rule';
import { SessionGuard } from 'src/identity/passport/session.guard';
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
    private engine: RuleEngineService,
  ) {
    this.engine.setRules([
      new GrammarErrorsRule(),
      new ConclusionRule(),
      new WordCountRule(),
      new ParagraphCountRule(),
      new LinkingDevicesRule(),
      new PassiveVoiceRule(),
      new PerfectTenseRule(),
      new SpellingErrorsRule(),
      new AcademicWordsRule(),
      new InformalWordsRule(),
      new ContractionsRule(),
      new EasyWordsRule(),
    ]);
  }

  @UseGuards(SessionGuard)
  @Post()
  create(@Body() createPaperDto: CreatePaperDto, @Req() req: any) {
    const studentId = req.user.id;
    return this.papersService.createPaper(createPaperDto, studentId);
  }

  @UseGuards(SessionGuard)
  @Get()
  async findAll(@Req() req: any) {
    const studentId = req.user.id;
    return await this.papersService.findAll({
      orderBy: {
        updatedAt: 'desc',
      },
      where: {
        studentId: studentId,
        OR: [
          { question: { not: '' } },
          {
            body: {
              not: '',
            },
          },
        ],
      },
    });
  }

  @UseGuards(SessionGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    const studentId = req.user.id;

    const paper = await this.papersService.findPaperById(id);
    if (paper && paper.studentId === studentId)
      return this.papersService.findPaperById(id);

    throw new NotFoundException();
  }

  @UseGuards(SessionGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePaperDto: UpdatePaperDto,
    @Req() req: any,
  ) {
    const studentId = req.user.id;
    const paper = await this.papersService.findPaperById(id);

    if (paper && paper.studentId === studentId) {
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

  @UseGuards(SessionGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const studentId = req.user.id;

    const paper = await this.papersService.findPaperById(id);
    if (paper && paper.studentId === studentId)
      return this.papersService.remove(id);

    throw new NotFoundException();
  }
}
