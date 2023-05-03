import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class MasterFileParamsDto {
  @Type(() => Number)
  @ApiProperty({ example: '1' })
  @IsInt()
  @IsPositive()
  category: number;

  @Type(() => Number)
  @ApiProperty({ example: '3' })
  @IsInt()
  @IsPositive()
  knowledgeArea: number;

  @ApiProperty({ example: '2,4,3', type: 'string' })
  @IsNumber({ allowNaN: false }, { each: true })
  @Transform(({ value }) =>
    value
      ? value
          .split(',')
          .map((value: string) => +value)
          .filter((value: number) => value)
      : [],
  )
  evaluationRole: number[];
}
