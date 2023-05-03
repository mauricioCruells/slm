import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { QuestionsFileProperties } from './questions-file-properties.dto';

export class QuestionsFileDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => QuestionsFileProperties)
  questions: QuestionsFileProperties[];
}
