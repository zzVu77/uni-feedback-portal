import { ActiveUserData } from '../modules/auth/interfaces/active-user-data.interface';
import { REQUEST_USER_KEY } from '../modules/auth/constants/auth.constants';

declare global {
  namespace Express {
    export interface Request {
      [REQUEST_USER_KEY]?: ActiveUserData;
    }
  }
}
