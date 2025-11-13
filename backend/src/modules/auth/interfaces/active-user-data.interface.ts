import { UserRole } from '@prisma/client';

export interface ActiveUserData {
  /**
   * The user's ID.
   */
  sub: string;

  /**
   * The user's role.
   */
  role: UserRole;
}
