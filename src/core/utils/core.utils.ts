import { ClassConstructor, plainToInstance } from 'class-transformer';

import { Pagination } from '../docs';
import { PaginationDto, MultipleResponse, SingleResponse } from '../dto';

export const getORMSkipAndTake = (
  pagination: PaginationDto,
): { take: number; skip: number } => {
  if (!pagination.items) {
    return { take: null, skip: 0 };
  }
  return {
    take: pagination.items,
    skip: (pagination.page - 1) * pagination.items,
  };
};

export const serializeResponse = <T>(
  classType: ClassConstructor<T>,
  data: unknown,
  excludeExtraneousValues = true,
): SingleResponse<T> => {
  return {
    data: plainToInstance(classType, data, { excludeExtraneousValues }),
  };
};

export const serializeMultipleResponse = <T>(
  classType: ClassConstructor<T>,
  data: unknown[],
  pagination?: PaginationDto,
  totalItems?: number,
  excludeExtraneousValues = true,
): MultipleResponse<T[]> => {
  const response = {
    data: plainToInstance(classType, data, { excludeExtraneousValues }),
  };

  if (!pagination && !totalItems) {
    return response;
  }

  return {
    ...response,
    pagination: getPagination(pagination, totalItems),
  };
};

export const getPagination = (
  pagination: PaginationDto,
  totalItems: number,
): Pagination => {
  const totalPages = Math.ceil(totalItems / pagination.items);
  const nextPage = pagination.page < totalPages ? pagination.page + 1 : null;
  const previousPage =
    pagination.page > 1 && pagination.page <= totalPages
      ? pagination.page - 1
      : null;

  return {
    current_page: pagination.page,
    items_per_page: pagination.items,
    total_items: totalItems,
    total_pages: totalPages,
    previous_page: previousPage,
    next_page: nextPage,
  };
};

export const notFoundByIdMessage = (entityName: string, id: number): string => {
  return `${entityName} with ID ${id} was not found`;
};

export const notFoundPluralMessage = (pluralEntityName: string): string => {
  return `There were not any ${pluralEntityName} found`;
};
