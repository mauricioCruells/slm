import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export const ExcludeWhenNotDev = () =>
  applyDecorators(
    process.env.NODE_ENV !== 'development'
      ? ApiExcludeEndpoint()
      : () => undefined,
  );
