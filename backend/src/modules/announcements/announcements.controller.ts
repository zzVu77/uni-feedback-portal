import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import {
  ApiTags,
  ApiOkResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  AnnouncementDetailDto,
  AnnouncementListResponseDto,
  AnnouncementParamDto,
  CreateAnnouncementDto,
  QueryAnnouncementsDto,
  UpdateAnnouncementDto,
} from './dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Announcements')
@Controller('announcement')
@ApiBearerAuth() // Apply Bearer Auth to all endpoints in this controller
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  // No @Roles decorator means any authenticated user can access
  @Get()
  @ApiOkResponse({
    description: 'List announcements',
    type: AnnouncementListResponseDto,
  })
  @ApiOperation({ summary: 'Get all announcements (Authenticated users only)' })
  getAnnouncements(
    @Query() query: QueryAnnouncementsDto,
  ): Promise<AnnouncementListResponseDto> {
    return this.announcementsService.getAnnouncements(query);
  }

  // No @Roles decorator means any authenticated user can access
  @Get(':id')
  @ApiOkResponse({
    description: 'Get announcement detail by ID',
    type: AnnouncementDetailDto,
  })
  @ApiOperation({
    summary: 'Get announcement detail by ID (Authenticated users only)',
  })
  getAnnouncementDetail(
    @Param() params: AnnouncementParamDto,
  ): Promise<AnnouncementDetailDto> {
    return this.announcementsService.getAnnouncementDetail(params.id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.DEPARTMENT_STAFF)
  @ApiOperation({ summary: 'Create new announcement (Staff only)' })
  @ApiOkResponse({
    description: 'Announcement created successfully',
    type: AnnouncementDetailDto,
  })
  createAnnouncement(
    @Body() dto: CreateAnnouncementDto,
    @ActiveUser() user: ActiveUserData,
  ): Promise<AnnouncementDetailDto> {
    return this.announcementsService.createAnnouncement(dto, user);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DEPARTMENT_STAFF)
  @ApiOkResponse({
    description: 'Update an announcement by ID',
    type: AnnouncementDetailDto,
  })
  @ApiOperation({ summary: 'Update an existing announcement (Staff only)' })
  update(
    @Param() params: AnnouncementParamDto,
    @Body() dto: UpdateAnnouncementDto,
    @ActiveUser() user: ActiveUserData,
  ): Promise<AnnouncementDetailDto> {
    return this.announcementsService.updateAnnouncement(params.id, dto, user);
  }
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DEPARTMENT_STAFF)
  @ApiOkResponse({
    description: 'Delete an announcement by ID',
    schema: {
      example: { success: true },
    },
  })
  @ApiOperation({ summary: 'Delete an announcement (Staff only)' })
  deleteAnnouncement(
    @Param() params: AnnouncementParamDto,
    @ActiveUser() user: ActiveUserData,
  ): Promise<{ success: boolean }> {
    return this.announcementsService.deleteAnnouncement(params.id, user);
  }
}
