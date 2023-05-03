import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsPositive,
  IsOptional,
  IsInt,
} from 'class-validator';

export class TopicDto {
  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  uid: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  comments?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  skillId?: number;
}
