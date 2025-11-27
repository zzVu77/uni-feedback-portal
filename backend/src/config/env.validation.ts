import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';
import 'dotenv/config'; // Tự động load file .env

// Định nghĩa class chứa tất cả các biến môi trường
class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsString()
  @IsNotEmpty()
  JWT_ACCESS_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_ACCESS_TOKEN_TTL: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_TOKEN_TTL: string;

  @IsString()
  @IsNotEmpty()
  SUPABASE_PROJECT_REF: string;

  @IsString()
  @IsNotEmpty()
  SUPABASE_S3_ACCESS_KEY: string;

  @IsString()
  @IsNotEmpty()
  SUPABASE_S3_SECRET_KEY: string;

  @IsString()
  @IsNotEmpty()
  SUPABASE_BUCKET_NAME: string;

  @IsString()
  @IsNotEmpty()
  SUPABASE_SERVICE_ROLE_KEY: string;
}

const config = plainToInstance(EnvironmentVariables, process.env, {
  enableImplicitConversion: true,
});

const errors = validateSync(config, {
  skipMissingProperties: false,
});

if (errors.length > 0) {
  throw new Error(errors.toString());
}

export default config;

export function validate(config: Record<string, unknown>) {
  const errors = validateSync(config, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
}
