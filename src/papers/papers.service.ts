import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePaperDto } from './dto/create-paper.dto';
import { UpdatePaperDto } from './dto/update-paper.dto';

@Injectable()
export class PapersService {
  constructor(private prisma: PrismaService) {}

  createPaper(paper: CreatePaperDto) {
    return this.prisma.paper.create({
      data: { question: paper.question || '', body: paper.body || '' },
    });
  }

  findAll(options: {
    skip?: number;
    take?: number;
    where?: Prisma.PaperWhereInput;
    orderBy?: Prisma.PaperOrderByInput;
  }) {
    const { skip, take, where, orderBy } = options;

    return this.prisma.paper.findMany({
      skip,
      take,
      where,
      orderBy,
    });
  }

  findOne(id: string) {
    return this.prisma.paper.findFirst({ where: { id: id } });
  }

  update(id: string, updatePaperDto: UpdatePaperDto) {
    this.prisma.paper.update({ where: { id: id }, data: updatePaperDto });
  }

  remove(id: string) {
    return this.prisma.paper.delete({ where: { id: id } });
  }
}
