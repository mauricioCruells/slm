import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';

import { MasterFileProperties } from './master-file-properties.dto';

export class MasterFileDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => MasterFileProperties)
  data: MasterFileProperties[];
}
