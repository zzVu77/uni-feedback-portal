import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateToxicKeywordDto } from './dto/create-toxic-keyword.dto';
import { UpdateToxicKeywordDto } from './dto/update-toxic-keyword.dto';
import {
  QueryToxicKeywordDto,
  ToxicKeywordSortOption,
  SortDirection,
} from './dto/query-toxic-keyword.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

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

  async findAll(queryDto: QueryToxicKeywordDto) {
    const {
      page = 1,
      pageSize = 10,
      search,
      orderBy = ToxicKeywordSortOption.DATE,
      orderDirection = SortDirection.DESC,
    } = queryDto;

    const where: Prisma.ToxicKeywordWhereInput = search
      ? { keyword: { contains: search, mode: 'insensitive' } }
      : {};

    const sortField =
      orderBy === ToxicKeywordSortOption.KEYWORD ? 'keyword' : 'createdAt';

    const [results, total] = await Promise.all([
      this.prisma.toxicKeyword.findMany({
        where,
        orderBy: { [sortField]: orderDirection },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.toxicKeyword.count({ where }),
    ]);

    return { results, total };
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
