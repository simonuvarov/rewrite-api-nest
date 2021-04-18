import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePaperDto } from './dto/create-paper.dto';
import { SaveGradedPaperDto } from './dto/save-graded-paper-dto';

@Injectable()
export class PapersService {
  constructor(private prisma: PrismaService) {}

  createPaper(paper: CreatePaperDto, userId: string) {
    return this.prisma.paper.create({
      data: {
        question: paper.question || '',
        body: paper.body || '',
        author: { connect: { id: userId } },
      },
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

  findPaperById(id: string) {
    return this.prisma.paper.findFirst({ where: { id: id } });
  }

  async update(id: string, savePaperDto: SaveGradedPaperDto) {
    return await this.prisma.paper.update({
      where: { id: id },
      data: savePaperDto,
    });
  }

  remove(id: string) {
    return this.prisma.paper.delete({ where: { id: id } });
  }
}
