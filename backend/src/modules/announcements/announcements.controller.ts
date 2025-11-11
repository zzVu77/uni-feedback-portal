import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { ApiTags, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import {
  AnnouncementDetailDto,
  AnnouncementListResponseDto,
  AnnouncementParamDto,
  CreateAnnouncementDto,
  QueryAnnouncementsDto,
  UpdateAnnouncementDto,
} from './dto';

@ApiTags('Announcements')
@Controller('announcement')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  userId = '550e8400-e29b-41d4-a716-44665544000a';
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
    @Param() params: AnnouncementParamDto,
  ): Promise<AnnouncementDetailDto> {
    return this.announcementsService.getAnnouncementDetail(params.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new announcement' })
  @ApiOkResponse({
    description: 'Announcement created successfully',
    type: AnnouncementDetailDto,
  })
  create(@Body() dto: CreateAnnouncementDto): Promise<AnnouncementDetailDto> {
    return this.announcementsService.createAnnouncement(dto, this.userId);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Update an announcement by ID',
    type: AnnouncementDetailDto,
  })
  @ApiOperation({ summary: 'Update an existing announcement' })
  update(
    @Param() params: AnnouncementParamDto,
    @Body() dto: UpdateAnnouncementDto,
  ): Promise<AnnouncementDetailDto> {
    return this.announcementsService.updateAnnouncement(
      params.id,
      dto,
      this.userId,
    );
  }
  @Delete(':id')
  @ApiOkResponse({
    description: 'Delete an announcement by ID',
    schema: {
      example: { success: true },
    },
  })
  @ApiOperation({ summary: 'Delete an announcement' })
  delete(@Param() params: AnnouncementParamDto): Promise<{ success: boolean }> {
    return this.announcementsService.deleteAnnouncement(params.id, this.userId);
  }
}
