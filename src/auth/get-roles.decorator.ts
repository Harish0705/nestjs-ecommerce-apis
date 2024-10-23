import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/user/user-roles.enum';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);

/* Note: More info about this approach https://docs.nestjs.com/fundamentals/execution-context#reflection-and-metadata */
