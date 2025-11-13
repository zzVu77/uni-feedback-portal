// // auth/auth.service.contract.ts
// import { LoginDto } from './dto/login.dto';
// import { LogoutDto } from './dto/logout.dto';
// import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
// import { ResetPasswordDto } from './dto/reset-password.dto';
// import { ChangePasswordDto } from './dto/change-password.dto';
// import { TokensResponseDto } from './dto/tokens-response.dto';

// export interface AuthServiceContract {
//   login(dto: LoginDto): Promise<TokensResponseDto>; // issue access/refresh, include user payload
//   logout(userId: number, dto?: LogoutDto): Promise<{ success: true }>;
//   requestPasswordReset(
//     dto: RequestPasswordResetDto,
//   ): Promise<{ success: true }>;
//   resetPassword(dto: ResetPasswordDto): Promise<{ success: true }>;
//   changePassword(
//     userId: number,
//     dto: ChangePasswordDto,
//   ): Promise<{ success: true }>;
// }
