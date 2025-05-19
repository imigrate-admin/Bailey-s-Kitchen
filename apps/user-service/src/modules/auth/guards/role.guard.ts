import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true; // No roles specified means no role restriction
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // For now, we'll assume admin role is stored in the user object
    // You might want to adjust this based on your actual user model
    return user && roles.includes(user.role);
  }
} 