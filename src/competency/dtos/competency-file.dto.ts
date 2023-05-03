import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';

import { CompetencyFileProperties } from './competency-file-properties.dto';

export class CompetencyFile {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CompetencyFileProperties)
  competencies: CompetencyFileProperties[];
}
