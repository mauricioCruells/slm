import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class KnowledgeAreaIdsDto {
  @ApiProperty({
    type: 'string',
    example: '2,5,3',
    description: 'knowledgeArea Ids to add to the category',
  })
  @IsNumber({ allowNaN: false }, { each: true })
  @Transform(({ value }) =>
    value
      ? value
          .split(',')
          .map((value: string) => +value)
          .filter((value: number) => value)
      : [],
  )
  knowledgeAreas: number[];
}
