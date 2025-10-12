import { Controller, Get, Param, Query } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { ApiTags, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AnnouncementListResponseDto } from './dto/query-announcements-respone.dto';
import { QueryAnnouncementsDto } from './dto/query-announcements.dto';
import { AnnouncementDetailDto } from './dto/get-announcement-respone-dto';
import { GetAnnouncementParamDto } from './dto/get-announcement-param.dto';

@ApiTags('Announcements')
@Controller('announcement')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Get()
  @ApiOkResponse({
    description: 'List announcements',
    type: AnnouncementListResponseDto,
  })
  @ApiOperation({ summary: 'Get all announcements' })
  getAnnouncements(
    @Query() query: QueryAnnouncementsDto,
  ): Promise<AnnouncementListResponseDto> {
    return this.announcementsService.getAnnouncements(query);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Get announcement detail by ID',
    type: AnnouncementDetailDto,
  })
  @ApiOperation({ summary: 'Get announcement detail by ID' })
  getAnnouncementDetail(
    @Param() params: GetAnnouncementParamDto,
  ): Promise<AnnouncementDetailDto> {
    return this.announcementsService.getAnnouncementDetail(params.id);
  }
}
