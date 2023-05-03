import { QuestionTypeEnum, SeniorityLevelEnum } from '@Core/enums';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBooleanString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class QuestionsFileProperties {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsEnum(QuestionTypeEnum, {
    message: `type must be one of the following values: 'Short Response', 'Multiple Choice', 'Long Response', 'Upload a file'`,
  })
  @IsNotEmpty()
  type: QuestionTypeEnum;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @IsNotEmpty()
  score: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @IsNotEmpty()
  time: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(SeniorityLevelEnum, {
    message: `seniorityLevel must be one of the following values: 'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5', 'Level 6', 'Level 7'`,
  })
  seniorityLevel: SeniorityLevelEnum;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  topicUid: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  topicName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  option1: string;

  @ApiProperty()
  @IsBooleanString()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' && value.toLowerCase())
  option1IsCorrect: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  option2: string;

  @ApiProperty()
  @IsBooleanString()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' && value.toLowerCase())
  option2IsCorrect: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  option3: string;

  @ApiProperty()
  @IsBooleanString()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' && value.toLowerCase())
  option3IsCorrect: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  option4: string;

  @ApiProperty()
  @IsBooleanString()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' && value.toLowerCase())
  option4IsCorrect: string;
}
