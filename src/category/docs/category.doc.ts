import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { KnowledgeAreaDoc } from '@Knowledge-Area/docs';

export class CategoryDoc {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  knowledgeAreas: KnowledgeAreaDoc[];
}
