import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const ApiArrayStringResponse = (status?: number) => {
  return applyDecorators(
    ApiResponse({
      status: status ? status : 200,
      schema: {
        allOf: [
          {
            properties: {
              data: {
                type: 'array',
                items: { type: 'string' },
              },
            },
          },
        ],
      },
    }),
  );
};
