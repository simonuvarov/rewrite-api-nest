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

@Controller('papers')
export class PapersController {
  constructor(
    private readonly papersService: PapersService,
    private grammarService: GrammarService,
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
    return await this.papersService.findAll({ where: { authorId: userId } });
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
      const result = await this.papersService.update(id, updatePaperDto);
      const issues = await this.grammarService.check(result.body);
      return { ...result, issues };
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
