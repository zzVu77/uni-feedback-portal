import { AuthResponseDto } from './dto';

export abstract class AuthServiceContract {
  abstract Login(email: string, password: string): Promise<AuthResponseDto>;

  abstract RefreshToken(refreshToken: string): Promise<AuthResponseDto>;

  abstract Logout(refreshToken: string): Promise<void>;
}
