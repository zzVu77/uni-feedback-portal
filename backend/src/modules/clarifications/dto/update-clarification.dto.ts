import { PartialType } from '@nestjs/mapped-types';
import { CreateClarificationDto } from './create-clarification.dto';

export class UpdateClarificationDto extends PartialType(
  CreateClarificationDto,
) {}
