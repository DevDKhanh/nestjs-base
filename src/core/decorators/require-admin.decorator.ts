import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { DecoratorMetadata } from './metadata.enum';
import { AuthGuard } from 'src/core/guards/auth.guard';

export function RequireAdmin(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    SetMetadata(DecoratorMetadata.RequireAdminRole, true),
    UseGuards(AuthGuard),
  );
}
