import { OmitType } from '@nestjs/swagger';
import { QueryFeedbacksDto } from 'src/modules/feedbacks/dto';

export class QueryFeedbackByStaffDto extends OmitType(QueryFeedbacksDto, [
  'departmentId',
] as const) {}
