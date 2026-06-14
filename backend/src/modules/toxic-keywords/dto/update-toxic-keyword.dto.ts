import { PartialType } from '@nestjs/swagger';
import { CreateToxicKeywordDto } from './create-toxic-keyword.dto';

export class UpdateToxicKeywordDto extends PartialType(CreateToxicKeywordDto) {}
