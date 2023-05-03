import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MasterFileProperties {
  @IsString()
  @IsNotEmpty()
  @Expose()
  competencyUID: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  competencyName: string;

  @IsOptional()
  @IsString()
  @Expose()
  competencyDescription: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  skillName: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  skillUID: string;

  @IsOptional()
  @IsString()
  @Expose()
  skillDescription: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  topicUID: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  topicName: string;

  @IsOptional()
  @IsString()
  @Expose()
  topicDescription: string;

  @IsOptional()
  @IsString()
  @Expose()
  comment: string;
}
