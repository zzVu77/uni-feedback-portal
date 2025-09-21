import { Controller } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  // @Post()
  // create(@Body() createAnnouncementDto: CreateAnnouncementDto) {
  //   return this.announcementsService.create(createAnnouncementDto);
  // }

  // @Get()
  // findAll() {
  //   return this.announcementsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.announcementsService.findOne(+id);
  // }

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
