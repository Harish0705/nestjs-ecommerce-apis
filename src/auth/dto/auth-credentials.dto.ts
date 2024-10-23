import { UserRole } from 'src/user/user-roles.enum';

export class AuthCredentialsDto {
  email: string;
  password: string;
  role: UserRole;
}
