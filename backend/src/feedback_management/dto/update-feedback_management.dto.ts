import { PartialType } from '@nestjs/mapped-types';
import { CreateFeedbackManagementDto } from './create-feedback_management.dto';

export class UpdateFeedbackManagementDto extends PartialType(
  CreateFeedbackManagementDto,
) {}
