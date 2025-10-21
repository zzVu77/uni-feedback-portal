import { Controller } from '@nestjs/common';
import { ModerationService } from './moderation.service';

@Controller('moderation')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  // @Post()
  // create(@Body() createModerationDto: CreateModerationDto) {
  //   return this.moderationService.create(createModerationDto);
  // }

  // @Get()
  // findAll() {
  //   return this.moderationService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.moderationService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateModerationDto: UpdateModerationDto,
  // ) {
  //   return this.moderationService.update(+id, updateModerationDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.moderationService.remove(+id);
  // }
}
