import { SortOptions, sortFieldMapping } from '../enums';

export function parseSortOptions(sortQuery: string): SortOptions[] {
  const sortOptions: SortOptions[] = [];

  const sortFields = Object.fromEntries(Object.entries(sortFieldMapping));

  // the actual input from the user
  const sortOption = sortQuery.split(',');

  sortOption.forEach((field) => {
    const sortOrder = field.startsWith('-') ? 'DESC' : 'ASC';
    const fieldName = field.startsWith('-') ? field.slice(1) : field;
    const sortField = sortFields[fieldName];

    if (sortField) {
      sortOptions.push({ sortField, sortOrder });
    }
  });

  return sortOptions;
}

export function parseCommaSeparatedParams(value: string): string[] {
  return value
    .split(',')
    .flatMap((value) => value.trim().split(' '))
    .filter((value) => value);
}

export function parseCommaSeparatedNumbers(value: string): number[] {
  return value
    .split(',')
    .map((value) => +value)
    .filter((value) => value);
}
