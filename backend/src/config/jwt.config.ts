import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';
import 'dotenv/config'; // Make sure to load .env variables

class EnvConfig {
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
}

const validatedConfig = plainToInstance(EnvConfig, process.env, {
  enableImplicitConversion: true,
});

const errors = validateSync(validatedConfig, {
  skipMissingProperties: false,
});

if (errors.length > 0) {
  throw new Error(errors.toString());
}

export default validatedConfig;
