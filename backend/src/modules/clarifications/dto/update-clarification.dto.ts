import { PartialType } from '@nestjs/swagger';
import { CreateClarificationDto } from './create-clarification.dto';

export class UpdateClarificationDto extends PartialType(
  CreateClarificationDto,
) {}
