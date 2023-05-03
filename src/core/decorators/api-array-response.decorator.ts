import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiArrayResponse = <TModel extends Type<any>>(
  model: TModel,
  status?: number,
) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      status: status ? status : 200,
      schema: {
        allOf: [
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
