import {
  ValidateRepeatedLevelValues,
  ValidateUpperWithLowerValue,
} from '@Core/decorators';
import { L1LowerScoreDefault, L7UpperScoreDefault } from '@Core/utils';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsPositive,
  IsOptional,
  IsArray,
  IsInt,
  ArrayUnique,
  ArrayMinSize,
  IsNumber,
  Equals,
} from 'class-validator';

export class KnowledgeAreaDto {
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

  @ApiProperty({ default: 0 })
  @Expose()
  @ValidateRepeatedLevelValues('L1UpperScore')
  @Equals(L1LowerScoreDefault)
  L1LowerScore: number;

  @ApiProperty()
  @Expose()
  @ValidateUpperWithLowerValue('L2LowerScore')
  @IsPositive()
  @IsNumber({
    maxDecimalPlaces: 10,
    allowNaN: false,
    allowInfinity: false,
  })
  L1UpperScore: number;

  @ApiProperty()
  @Expose()
  @ValidateRepeatedLevelValues('L2UpperScore')
  @IsPositive()
  @IsNumber({
    maxDecimalPlaces: 10,
    allowNaN: false,
    allowInfinity: false,
  })
  L2LowerScore: number;

  @ApiProperty()
  @Expose()
  @ValidateUpperWithLowerValue('L3LowerScore')
  @IsPositive()
  @IsNumber({
    maxDecimalPlaces: 10,
    allowNaN: false,
    allowInfinity: false,
  })
  L2UpperScore: number;

  @ApiProperty()
  @Expose()
  @ValidateRepeatedLevelValues('L3UpperScore')
  @IsPositive()
  @IsNumber({
    maxDecimalPlaces: 10,
    allowNaN: false,
    allowInfinity: false,
  })
  L3LowerScore: number;

  @ApiProperty()
  @Expose()
  @ValidateUpperWithLowerValue('L4LowerScore')
  @IsPositive()
  @IsNumber({
    maxDecimalPlaces: 10,
    allowNaN: false,
    allowInfinity: false,
  })
  L3UpperScore: number;

  @ApiProperty()
  @Expose()
  @ValidateRepeatedLevelValues('L4UpperScore')
  @IsPositive()
  @IsNumber({
    maxDecimalPlaces: 10,
  })
  L4LowerScore: number;

  @ApiProperty()
  @Expose()
  @ValidateUpperWithLowerValue('L5LowerScore')
  @IsPositive()
  @IsNumber({
    maxDecimalPlaces: 10,
    allowNaN: false,
    allowInfinity: false,
  })
  L4UpperScore: number;

  @ApiProperty()
  @Expose()
  @ValidateRepeatedLevelValues('L5UpperScore')
  @IsPositive()
  @IsNumber({
    maxDecimalPlaces: 10,
    allowNaN: false,
    allowInfinity: false,
  })
  L5LowerScore: number;

  @ApiProperty()
  @Expose()
  @ValidateUpperWithLowerValue('L6LowerScore')
  @IsPositive()
  @IsNumber({
    maxDecimalPlaces: 10,
    allowNaN: false,
    allowInfinity: false,
  })
  L5UpperScore: number;

  @ApiProperty()
  @Expose()
  @ValidateRepeatedLevelValues('L6UpperScore')
  @IsPositive()
  @IsNumber({
    maxDecimalPlaces: 10,
    allowNaN: false,
    allowInfinity: false,
  })
  L6LowerScore: number;

  @ApiProperty()
  @Expose()
  @ValidateUpperWithLowerValue('L7LowerScore')
  @IsPositive()
  @IsNumber({
    maxDecimalPlaces: 10,
    allowNaN: false,
    allowInfinity: false,
  })
  L6UpperScore: number;

  @ApiProperty()
  @Expose()
  @ValidateRepeatedLevelValues('L7UpperScore')
  @IsPositive()
  @IsNumber({
    maxDecimalPlaces: 10,
    allowNaN: false,
    allowInfinity: false,
  })
  L7LowerScore: number;

  @ApiProperty({ default: 100 })
  @Expose()
  @Equals(L7UpperScoreDefault)
  L7UpperScore: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @ArrayUnique()
  @ArrayMinSize(1)
  competenciesIds?: number[];
}
