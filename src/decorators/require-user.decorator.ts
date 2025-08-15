import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { DecoratorMetadata } from './metadata.enum';

export function RequireUser(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    SetMetadata(DecoratorMetadata.RequireUserRole, true),
    UseGuards(AuthGuard),
  );
}
