import { Controller, Get, Param, Query } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { ApiTags, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { QueryAnnouncementsResponseDto } from './dto/query-announcements-respone.dto';
import { QueryAnnouncementsDto } from './dto/query-announcements.dto';
import { AnnouncementDetailDto } from './dto/get-announcement-respone-dto';
import { GetAnnouncementParamDto } from './dto/get-announcement-param.dto';

@ApiTags('Announcements')
@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  // @Post()
  // create(@Body() createAnnouncementDto: CreateAnnouncementDto) {
  //   return this.announcementsService.create(createAnnouncementDto);
  // }

  @Get()
  @ApiOkResponse({
    description: 'List announcements',
    type: QueryAnnouncementsResponseDto, // Swagger hiển thị array AnnouncementDto
  })
  @ApiOperation({ summary: 'Get all announcements' })
  findAll(
    @Query() query: QueryAnnouncementsDto,
  ): Promise<QueryAnnouncementsResponseDto> {
    return this.announcementsService.list(query);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Get announcement detail by ID',
    type: AnnouncementDetailDto, // Swagger hiển thị array AnnouncementDto
  })
  @ApiOperation({ summary: 'Get announcement detail by ID' })
  findOne(
    @Param() params: GetAnnouncementParamDto,
  ): Promise<AnnouncementDetailDto> {
    return this.announcementsService.get(params.id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  // ) {
  //   return this.announcementsService.update(+id, updateAnnouncementDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.announcementsService.remove(+id);
  // }
}
