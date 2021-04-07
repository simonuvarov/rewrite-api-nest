import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePaperDto } from './dto/create-paper.dto';
import { UpdatePaperDto } from './dto/update-paper.dto';
import { PapersService } from './papers.service';

@Controller('papers')
export class PapersController {
  constructor(private readonly papersService: PapersService) {}

  @Post()
  create(@Body() createPaperDto: CreatePaperDto) {
    return this.papersService.createPaper(createPaperDto);
  }

  @Get()
  findAll() {
    return this.papersService.findAll({});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.papersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaperDto: UpdatePaperDto) {
    return this.papersService.update(id, updatePaperDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const found = !!(await this.findOne(id));
    if (!found) throw new NotFoundException();

    return await this.papersService.remove(id);
  }
}
