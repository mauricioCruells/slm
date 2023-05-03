import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TopicWithoutRelations {
  @IsString()
  @IsNotEmpty()
  uid: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  comments?: string;
}
