import { Controller } from '@nestjs/common';
import { FeedbackManagementService } from './feedback_management.service';

@Controller('feedback-management')
export class FeedbackManagementController {
  constructor(
    private readonly feedbackManagementService: FeedbackManagementService,
  ) {}

  // @Post()
  // create(@Body() createFeedbackManagementDto: CreateFeedbackManagementDto) {
  //   return this.feedbackManagementService.create(createFeedbackManagementDto);
  // }

  // @Get()
  // findAll() {
  //   return this.feedbackManagementService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.feedbackManagementService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateFeedbackManagementDto: UpdateFeedbackManagementDto,
  // ) {
  //   return this.feedbackManagementService.update(
  //     +id,
  //     updateFeedbackManagementDto,
  //   );
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.feedbackManagementService.remove(+id);
  // }
}
