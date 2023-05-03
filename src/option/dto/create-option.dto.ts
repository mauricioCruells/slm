import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOptionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isCorrect: boolean;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  questionId: number;
}
