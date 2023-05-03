import { Expose } from 'class-transformer';
import { FindOperator } from 'typeorm';

export class UserWhereFilter {
  @Expose()
  employeeID?: FindOperator<string> | string;

  @Expose()
  email?: FindOperator<string> | string;
}
