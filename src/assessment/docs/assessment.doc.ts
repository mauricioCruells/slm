import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { KnowledgeAreaDoc } from '@Knowledge-Area/docs';
import { UserDoc } from '@User/docs';

export class AssessmentDoc {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  users: UserDoc[];

  @ApiProperty()
  @Expose()
  knowledgeArea: KnowledgeAreaDoc;
}
