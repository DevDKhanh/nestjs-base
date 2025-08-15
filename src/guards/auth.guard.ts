import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClsServiceManager } from 'nestjs-cls';
import { JwtData } from 'src/common';
import { DecoratorMetadata } from 'src/decorators/metadata.enum';

/**
 * Check if user has permission to call a specific route.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const cls = ClsServiceManager.getClsService();
    const jwtData = cls.get<JwtData>('jwt');
    return this.checkRole(jwtData, context);
  }

  private checkRole(
    jwtData: JwtData | undefined,
    context: ExecutionContext,
  ): boolean {
    const requireAdmin = this.checkDecorator(
      DecoratorMetadata.RequireAdminRole,
      context,
    );
    const requireUser = this.checkDecorator(
      DecoratorMetadata.RequireUserRole,
      context,
    );
    const optionalUser = this.checkDecorator(
      DecoratorMetadata.OptionalUser,
      context,
    );

    if (!jwtData && (requireUser || requireAdmin)) {
      throw new UnauthorizedException();
    }
    if ((requireUser && jwtData) || optionalUser) {
      return true;
    }
    throw new ForbiddenException();
  }

  private checkDecorator(
    decoratorMetadata: string,
    context: ExecutionContext,
  ): boolean {
    return (
      this.reflector.get<boolean>(decoratorMetadata, context.getHandler()) ??
      this.reflector.get<boolean>(decoratorMetadata, context.getClass())
    );
  }
}
