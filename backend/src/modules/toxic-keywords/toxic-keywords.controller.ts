import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ToxicKeywordsService } from './toxic-keywords.service';
import { CreateToxicKeywordDto } from './dto/create-toxic-keyword.dto';
import { UpdateToxicKeywordDto } from './dto/update-toxic-keyword.dto';
import { QueryToxicKeywordDto } from './dto/query-toxic-keyword.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('toxic-keywords')
@UseGuards(RolesGuard)
export class ToxicKeywordsController {
  constructor(private readonly toxicKeywordsService: ToxicKeywordsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createToxicKeywordDto: CreateToxicKeywordDto) {
    return this.toxicKeywordsService.create(createToxicKeywordDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll(@Query() query: QueryToxicKeywordDto) {
    return this.toxicKeywordsService.findAll(query);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.toxicKeywordsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateToxicKeywordDto: UpdateToxicKeywordDto,
  ) {
    return this.toxicKeywordsService.update(id, updateToxicKeywordDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.toxicKeywordsService.remove(id);
  }
}
