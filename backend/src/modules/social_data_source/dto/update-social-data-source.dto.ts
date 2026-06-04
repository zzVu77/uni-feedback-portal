import { PartialType } from '@nestjs/swagger';
import { CreateSocialDataSourceDto } from './create-social-data-source.dto';

export class UpdateSocialDataSourceDto extends PartialType(
  CreateSocialDataSourceDto,
) {}
