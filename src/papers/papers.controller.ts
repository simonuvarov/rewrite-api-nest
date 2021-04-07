import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/identity/jwt-auth.guard';
import { CreatePaperDto } from './dto/create-paper.dto';
import { UpdatePaperDto } from './dto/update-paper.dto';
import { PapersService } from './papers.service';

@Controller('papers')
export class PapersController {
  constructor(private readonly papersService: PapersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPaperDto: CreatePaperDto) {
    return this.papersService.createPaper(createPaperDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.papersService.findAll({});
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.papersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaperDto: UpdatePaperDto) {
    return this.papersService.update(id, updatePaperDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const found = !!(await this.findOne(id));
    if (!found) throw new NotFoundException();

    return await this.papersService.remove(id);
  }
}
