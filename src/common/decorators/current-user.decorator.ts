import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extracts the authenticated userId from the request.
 * Usage: @CurrentUser() userId: string
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.userId;
  },
);
