import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
import {
  CreateSocialDataSourceDto,
  QuerySocialDataSourceDto,
  SocialDataSourceDto,
  SocialDataSourceListResponseDto,
  UpdateDataSourceStatusDto,
  UpdateSocialDataSourceDto,
} from './dto';

@Injectable()
export class SocialDataSourceService {
  constructor(private readonly prisma: PrismaService) {}

  private _ensureIsAdmin(user: ActiveUserData) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'You do not have permission to perform this action.',
      );
    }
  }

  async create(
    dto: CreateSocialDataSourceDto,
    user: ActiveUserData,
  ): Promise<SocialDataSourceDto> {
    this._ensureIsAdmin(user);

    const existingSource = await this.prisma.dataSources.findUnique({
      where: { url: dto.url },
    });

    if (existingSource) {
      throw new ConflictException(
        `Data source with URL "${dto.url}" already exists.`,
      );
    }

    const dataSource = await this.prisma.dataSources.create({
      data: dto,
    });

    return dataSource;
  }

  async findAll(
    query: QuerySocialDataSourceDto,
  ): Promise<SocialDataSourceListResponseDto> {
    const { page = 1, limit = 10, q, status, platform } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.DataSourcesWhereInput = {
      ...(status && { status }),
      ...(platform && { platform }),
      ...(q && {
        OR: [
          { groupName: { contains: q, mode: 'insensitive' } },
          { url: { contains: q, mode: 'insensitive' } },
        ],
      }),
    };

    const [dataSources, total] = await this.prisma.$transaction([
      this.prisma.dataSources.findMany({
        where,
        skip,
        take: limit,
        orderBy: { groupName: 'asc' },
      }),
      this.prisma.dataSources.count({ where }),
    ]);

    return { results: dataSources, total };
  }

  async findOne(id: string): Promise<SocialDataSourceDto> {
    const dataSource = await this.prisma.dataSources.findUnique({
      where: { id },
    });

    if (!dataSource) {
      throw new NotFoundException(`Data source with ID ${id} not found.`);
    }

    return dataSource;
  }

  async update(
    id: string,
    dto: UpdateSocialDataSourceDto,
    user: ActiveUserData,
  ): Promise<SocialDataSourceDto> {
    this._ensureIsAdmin(user);

    await this.findOne(id); // Ensures it exists

    if (dto.url) {
      const existingSource = await this.prisma.dataSources.findFirst({
        where: {
          url: dto.url,
          id: { not: id },
        },
      });
      if (existingSource) {
        throw new ConflictException(
          `Data source with URL "${dto.url}" already exists.`,
        );
      }
    }

    const updatedSource = await this.prisma.dataSources.update({
      where: { id },
      data: dto,
    });

    return updatedSource;
  }

  async updateStatus(
    id: string,
    dto: UpdateDataSourceStatusDto,
    user: ActiveUserData,
  ): Promise<SocialDataSourceDto> {
    this._ensureIsAdmin(user);

    await this.findOne(id); // Ensures it exists

    const updatedSource = await this.prisma.dataSources.update({
      where: { id },
      data: { status: dto.status },
    });

    return updatedSource;
  }
  async remove(id: string, user: ActiveUserData): Promise<void> {
    this._ensureIsAdmin(user);

    await this.findOne(id);

    await this.prisma.dataSources.delete({
      where: { id },
    });
  }
}
