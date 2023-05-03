import { Expose, Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  ValidateNested,
  IsDate,
  IsOptional,
} from 'class-validator';

export class UserFileProperties {
  @IsString()
  @IsNotEmpty()
  @Expose()
  employeeID: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @Expose()
  email: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value ? value : undefined))
  @Expose()
  platformRoleName: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value ? value : undefined))
  @Expose()
  evaluationRoleName: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value ? value : undefined))
  @Expose()
  seniorityLevelName: string;

  @IsDate()
  @Type(() => Date)
  joiningDate: Date;
}

export class UserFile {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UserFileProperties)
  users: UserFileProperties[];
}
