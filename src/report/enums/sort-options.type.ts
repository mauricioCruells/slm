import { SortFieldEnum } from './sort-field.enum';

export type SortOptions = {
  sortField: SortFieldEnum;
  sortOrder: 'ASC' | 'DESC';
};
