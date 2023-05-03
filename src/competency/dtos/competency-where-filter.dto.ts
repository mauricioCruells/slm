import { Expose } from 'class-transformer';
import { FindOperator } from 'typeorm';

export class CompetencyWhereFilter {
  @Expose()
  id?: FindOperator<number> | number;

  @Expose()
  uid?: FindOperator<string> | string;

  @Expose()
  name?: FindOperator<string> | string;

  @Expose()
  description?: FindOperator<string> | string;
}
