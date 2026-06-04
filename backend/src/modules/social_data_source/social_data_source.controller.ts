import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { SocialDataSourceService } from './social_data_source.service';
import {
  CreateSocialDataSourceDto,
  QuerySocialDataSourceDto,
  SocialDataSourceDto,
  SocialDataSourceListResponseDto,
  UpdateDataSourceStatusDto,
  UpdateSocialDataSourceDto,
} from './dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import type { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Social Data Sources')
@ApiBearerAuth()
@Controller('social-data-source')
export class SocialDataSourceController {
  constructor(
    private readonly socialDataSourceService: SocialDataSourceService,
  ) {}

  @Public()
  @Get('active-urls')
  @ApiOperation({ summary: 'Get all active URLs (Public)' })
  @ApiResponse({ status: 200, type: [String] })
  getActiveUrls() {
    return this.socialDataSourceService.getActiveUrls();
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new social data source (Admin only)' })
  @ApiBody({ type: CreateSocialDataSourceDto })
  @ApiResponse({ status: 201, type: SocialDataSourceDto })
  create(
    @Body() createDto: CreateSocialDataSourceDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.socialDataSourceService.create(createDto, user);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEPARTMENT_STAFF)
  @ApiOperation({ summary: 'Get all data sources (Admin only)' })
  @ApiResponse({ status: 200, type: SocialDataSourceListResponseDto })
  findAll(@Query() query: QuerySocialDataSourceDto) {
    return this.socialDataSourceService.findAll(query);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEPARTMENT_STAFF)
  @ApiOperation({ summary: 'Get a specific data source (Admin only)' })
  @ApiResponse({ status: 200, type: SocialDataSourceDto })
  findOne(@Param('id') id: string) {
    return this.socialDataSourceService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a data source (Admin only)' })
  @ApiBody({ type: UpdateSocialDataSourceDto })
  @ApiResponse({ status: 200, type: SocialDataSourceDto })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateSocialDataSourceDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.socialDataSourceService.update(id, updateDto, user);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update status of a data source (Admin only)' })
  @ApiBody({ type: UpdateDataSourceStatusDto })
  @ApiResponse({ status: 200, type: SocialDataSourceDto })
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateDataSourceStatusDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.socialDataSourceService.updateStatus(id, updateStatusDto, user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a data source (Admin only)' })
  @ApiResponse({ status: 200, description: 'Data source deleted successfully' })
  remove(@Param('id') id: string, @ActiveUser() user: ActiveUserData) {
    return this.socialDataSourceService.remove(id, user);
  }
}
