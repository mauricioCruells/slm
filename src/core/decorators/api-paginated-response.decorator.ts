import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

import { MultipleResponse } from '../dto';

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
  status?: number,
) => {
  return applyDecorators(
    ApiExtraModels(MultipleResponse, model),
    ApiResponse({
      status: status ? status : 200,
      schema: {
        allOf: [
          { $ref: getSchemaPath(MultipleResponse) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
