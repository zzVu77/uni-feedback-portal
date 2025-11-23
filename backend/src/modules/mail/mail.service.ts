import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendPasswordResetOtp(email: string, otp: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Your Password Reset OTP Code',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset. Use the OTP code below to reset your password.</p>
        <h2>Your OTP code is: <strong>${otp}</strong></h2>
        <p>This code will expire in 5 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });
  }
}
