import { Controller } from '@nestjs/common';
import { ClarificationsService } from './clarifications.service';

@Controller('clarifications')
export class ClarificationsController {
  constructor(private readonly clarificationsService: ClarificationsService) {}

  // @Post()
  // create(@Body() createClarificationDto: CreateClarificationDto) {
  //   return this.clarificationsService.create(createClarificationDto);
  // }

  // @Get()
  // findAll() {
  //   return this.clarificationsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.clarificationsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateClarificationDto: UpdateClarificationDto,
  // ) {
  //   return this.clarificationsService.update(+id, updateClarificationDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.clarificationsService.remove(+id);
  // }
}
