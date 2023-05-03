export interface FilterDto<T> {
  where: T;
  relations?: string[];
}
