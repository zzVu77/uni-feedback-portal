import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateToxicKeywordDto } from './dto/create-toxic-keyword.dto';
import { UpdateToxicKeywordDto } from './dto/update-toxic-keyword.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ToxicKeywordsService {
  constructor(private prisma: PrismaService) {}

  async create(createToxicKeywordDto: CreateToxicKeywordDto) {
    const exists = await this.prisma.toxicKeyword.findUnique({
      where: { keyword: createToxicKeywordDto.keyword },
    });
    if (exists) {
      throw new ConflictException('Từ khóa này đã tồn tại');
    }
    return this.prisma.toxicKeyword.create({
      data: { keyword: createToxicKeywordDto.keyword },
    });
  }

  findAll(search?: string) {
    if (search) {
      return this.prisma.toxicKeyword.findMany({
        where: { keyword: { contains: search, mode: 'insensitive' } },
        orderBy: { createdAt: 'desc' },
      });
    }
    return this.prisma.toxicKeyword.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const keyword = await this.prisma.toxicKeyword.findUnique({
      where: { id },
    });
    if (!keyword) {
      throw new NotFoundException('Không tìm thấy từ khóa');
    }
    return keyword;
  }

  async update(id: string, updateToxicKeywordDto: UpdateToxicKeywordDto) {
    await this.findOne(id); // Check existence

    if (updateToxicKeywordDto.keyword) {
      const exists = await this.prisma.toxicKeyword.findFirst({
        where: {
          keyword: updateToxicKeywordDto.keyword,
          id: { not: id },
        },
      });
      if (exists) {
        throw new ConflictException('Từ khóa này đã tồn tại');
      }
    }

    return this.prisma.toxicKeyword.update({
      where: { id },
      data: updateToxicKeywordDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check existence
    return this.prisma.toxicKeyword.delete({ where: { id } });
  }
}
