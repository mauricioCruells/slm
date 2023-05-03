import { Expose } from 'class-transformer';
import { FindOperator } from 'typeorm';

export class WhereNameFilter {
  @Expose()
  name?: FindOperator<string> | string;
}
