import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { HashingService } from './hashing.service';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RolesGuard } from './guards/roles.guard';
import { TokenService } from './token.service';
import { APP_GUARD } from '@nestjs/core';
import { MailModule } from '../mail/mail.module';

@Global()
@Module({
  imports: [PrismaModule, JwtModule.register({}), MailModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    AuthService,
    HashingService,
    RolesGuard,
    TokenService,
  ],
  controllers: [AuthController],
  exports: [HashingService, TokenService],
})
export class AuthModule {}
