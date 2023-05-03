import { Expose } from 'class-transformer';
import { FindOperator } from 'typeorm';

export class TopicWhereFilter {
  @Expose()
  uid?: FindOperator<string> | string;

  @Expose()
  name?: FindOperator<string> | string;
}
