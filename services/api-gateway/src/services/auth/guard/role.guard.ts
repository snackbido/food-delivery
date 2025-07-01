import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '@gateway/services/auth/decorator/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user)
      throw new UnauthorizedException(
        'You does not login. Please login to access',
      );

    const hasRole = () => roles.includes(user.role);
    if (!hasRole())
      throw new ForbiddenException('You do not have permission to access');
    return user && user.role && hasRole();
  }
}
