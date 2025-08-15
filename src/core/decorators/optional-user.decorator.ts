import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { DecoratorMetadata } from './metadata.enum';

export function OptionalUser(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    SetMetadata(DecoratorMetadata.OptionalUser, true),
    UseGuards(AuthGuard),
  );
}
