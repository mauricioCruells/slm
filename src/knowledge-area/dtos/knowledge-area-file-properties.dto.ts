import {
  ValidateRepeatedLevelValues,
  ValidateUpperWithLowerValue,
} from '@Core/decorators';
import { L1LowerScoreDefault, L7UpperScoreDefault } from '@Core/utils';
import { Expose, Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  Equals,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class KnowledgeAreaFileProperties {
  @IsString()
  @IsNotEmpty()
  @Expose()
  uid: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  description: string;

  @Expose()
  @ValidateRepeatedLevelValues('L1UpperScore')
  @Equals(L1LowerScoreDefault)
  @Transform(({ value }) => (value?.includes(',') ? null : parseFloat(value)))
  L1LowerScore: number;

  @Expose()
  @ValidateUpperWithLowerValue('L2LowerScore')
  @IsPositive()
  @IsNumber({
    maxDecimalPlaces: 10,
    allowNaN: false,
    allowInfinity: false,
  })
  @Transform(({ value }) => (value?.includes(',') ? null : parseFloat(value)))
  L1UpperScore: number;

  @Expose()
  @ValidateRepeatedLevelValues('L2UpperScore')
  @IsPositive()
  @IsNumber({
    maxDecimalPlaces: 10,
    allowNaN: false,
    allowInfinity: false,
  })
  @Transform(({ value }) => (value?.includes(',') ? null : parseFloat(value)))
  L2LowerScore: number;

  @Expose()
  @ValidateUpperWithLowerValue('L3LowerScore')
  @IsPositive()
  @IsNumber({
    maxDecimalPlaces: 10,
    allowNaN: false,
    allowInfinity: false,
  })
  @Transform(({ value }) => (value?.includes(',') ? null : parseFloat(value)))
  L2UpperScore: number;

  @Expose()
  @ValidateRepeatedLevelValues('L3UpperScore')
  @IsPositive()
  @IsNumber({
    maxDecimalPlaces: 10,
    allowNaN: false,
    allowInfinity: false,
  })
  @Transform(({ value }) => (value?.includes(',') ? null : parseFloat(value)))
  L3LowerScore: number;

  @Expose()
  @ValidateUpperWithLowerValue('L4LowerScore')
  @IsPositive()
  @IsNumber({
    maxDecimalPlaces: 10,
    allowNaN: false,
    allowInfinity: false,
  })
  @Transform(({ value }) => (value?.includes(',') ? null : parseFloat(value)))
  L3UpperScore: number;

  @Expose()
  @ValidateRepeatedLevelValues('L4UpperScore')
  @IsPositive()
  @IsNumber({
    maxDecimalPlaces: 10,
    allowNaN: false,
    allowInfinity: false,
  })
  @Transform(({ value }) => (value?.includes(',') ? null : parseFloat(value)))
  L4LowerScore: number;

  @Expose()
  @ValidateUpperWithLowerValue('L5LowerScore')
  @IsPositive()
  @IsNumber({
    maxDecimalPlaces: 10,
    allowNaN: false,
    allowInfinity: false,
  })
  @Transform(({ value }) => (value?.includes(',') ? null : parseFloat(value)))
  L4UpperScore: number;

  @Expose()
  @ValidateRepeatedLevelValues('L5UpperScore')
  @IsPositive()
  @IsNumber({
    maxDecimalPlaces: 10,
    allowNaN: false,
    allowInfinity: false,
  })
  @Transform(({ value }) => (value?.includes(',') ? null : parseFloat(value)))
  L5LowerScore: number;

  @Expose()
  @ValidateUpperWithLowerValue('L6LowerScore')
  @IsPositive()
  @IsNumber({
    maxDecimalPlaces: 10,
    allowNaN: false,
    allowInfinity: false,
  })
  @Transform(({ value }) => (value?.includes(',') ? null : parseFloat(value)))
  L5UpperScore: number;

  @Expose()
  @ValidateRepeatedLevelValues('L6UpperScore')
  @IsPositive()
  @IsNumber({
    maxDecimalPlaces: 10,
    allowNaN: false,
    allowInfinity: false,
  })
  @Transform(({ value }) => (value?.includes(',') ? null : parseFloat(value)))
  L6LowerScore: number;

  @Expose()
  @ValidateUpperWithLowerValue('L7LowerScore')
  @IsPositive()
  @IsNumber({
    maxDecimalPlaces: 10,
    allowNaN: false,
    allowInfinity: false,
  })
  @Transform(({ value }) => (value?.includes(',') ? null : parseFloat(value)))
  L6UpperScore: number;

  @Expose()
  @ValidateRepeatedLevelValues('L7UpperScore')
  @IsPositive()
  @IsNumber({
    maxDecimalPlaces: 10,
    allowNaN: false,
    allowInfinity: false,
  })
  @Transform(({ value }) => (value?.includes(',') ? null : parseFloat(value)))
  L7LowerScore: number;

  @Expose()
  @Equals(L7UpperScoreDefault)
  @Transform(({ value }) => (value?.includes(',') ? null : parseFloat(value)))
  L7UpperScore: number;
}

export class KnowledgeAreaFile {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => KnowledgeAreaFileProperties)
  knowledgeAreas: KnowledgeAreaFileProperties[];
}
