import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * Auth Guard — supports both:
 *   1. Authorization: Bearer <userId>   (mock JWT for Flutter client)
 *   2. x-user-id: <userId>             (for curl/Postman testing)
 *
 * In production, this would verify Firebase ID tokens (Lab 2 §2).
 */
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Try Bearer token first
    const authHeader = request.headers['authorization'];
    if (authHeader?.startsWith('Bearer ')) {
      request.userId = authHeader.slice(7);
      return true;
    }

    // Fallback to x-user-id header
    const userId = request.headers['x-user-id'];
    if (userId) {
      request.userId = userId;
      return true;
    }

    throw new UnauthorizedException(
      'Authentication required. Provide Authorization: Bearer <token> or x-user-id header.',
    );
  }
}
