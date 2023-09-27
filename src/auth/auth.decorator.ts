import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { Role } from '../enums/role.enum';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './role/roles.guard';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),
  );
}
