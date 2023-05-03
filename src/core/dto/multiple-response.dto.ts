import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Pagination } from '../docs';

export class MultipleResponse<T> {
  @ApiProperty()
  data: T;
  @ApiPropertyOptional({ type: () => Pagination })
  pagination?: Pagination;
}
