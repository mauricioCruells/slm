import { Expose } from 'class-transformer';
import { FindOperator } from 'typeorm';

export class SkillWhereFilter {
  @Expose()
  uid?: FindOperator<string> | string;

  @Expose()
  name?: FindOperator<string> | string;
}
