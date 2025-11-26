import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateFeedbackDto } from './create-feedback.dto';

export class UpdateFeedbackDto extends OmitType(
  PartialType(CreateFeedbackDto),
  ['isAnonymous'] as const,
) {}
