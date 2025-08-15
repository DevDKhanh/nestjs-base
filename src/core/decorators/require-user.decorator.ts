import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { DecoratorMetadata } from './metadata.enum';
import { AuthGuard } from 'src/core/guards/auth.guard';

export function RequireUser(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    SetMetadata(DecoratorMetadata.RequireUserRole, true),
    UseGuards(AuthGuard),
  );
}
