import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { QuestionTypeEnum } from '@Core/enums';

export class CreateQuestionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsEnum(QuestionTypeEnum)
  @IsNotEmpty()
  type: QuestionTypeEnum;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  score: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  time: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  levelId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  topicId: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
