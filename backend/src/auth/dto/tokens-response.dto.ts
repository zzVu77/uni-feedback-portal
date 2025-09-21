export class TokensResponseDto {
  accessToken: string;
  refreshToken: string;
  user: {
    user_id: number;
    full_name: string | null;
    email: string;
    role: 'Student' | 'DepartmentStaff' | 'Admin';
    department_id: number;
    created_at: string;
  };
}
