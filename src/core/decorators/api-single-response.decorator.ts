import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

import { SingleResponse } from '../dto';

export const ApiSingleResponse = <TModel extends Type<any>>(
  model: TModel,
  status?: number,
) => {
  return applyDecorators(
    ApiExtraModels(SingleResponse, model),
    ApiResponse({
      status: status ? status : 200,
      schema: {
        allOf: [
          { $ref: getSchemaPath(SingleResponse) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    }),
  );
};
