import { UserRole } from '@prisma/client';

/**
 * Defines the structure of the user object attached to the request after authentication.
 * This payload is typically extracted from a JWT.
 */
export interface UserPayload {
  /**
   * The unique identifier (UUID) of the user.
   */
  userId: string;

  /**
   * The role of the user (e.g., STUDENT, DEPARTMENT_STAFF, ADMIN).
   */
  role: UserRole;
}
