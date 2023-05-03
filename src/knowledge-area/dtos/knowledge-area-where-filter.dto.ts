import { Expose } from 'class-transformer';
import { FindOperator } from 'typeorm';

export class KnowledgeAreaWhereFilter {
  @Expose()
  uid?: FindOperator<string> | string;

  @Expose()
  name?: FindOperator<string> | string;
}
