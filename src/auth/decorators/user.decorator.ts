import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthUser {
  sub: number;
  username: string;
  role: string;
  uti: string;
}

export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().user ?? {};
  },
);
