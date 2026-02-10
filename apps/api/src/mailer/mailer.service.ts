import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Transporter } from 'nodemailer';

@Injectable()
export class MailerService {
  constructor(
    @Inject('MAIL_TRANSPORT') private readonly transport: Transporter,
    private readonly config: ConfigService
  ) {}

  async sendEmailVerification(email: string, token: string) {
    const from = this.config.get<string>('MAIL_FROM');
    const appUrl = this.config.get<string>('APP_PUBLIC_URL') || 'http://localhost:3000';
    const verifyUrl = `${appUrl}/verify-email?token=${encodeURIComponent(token)}`;

    await this.transport.sendMail({
      from,
      to: email,
      subject: 'Подтверждение email',
      text: `Подтвердите email по ссылке: ${verifyUrl}`
    });
  }

  async sendPasswordReset(email: string, token: string) {
    const from = this.config.get<string>('MAIL_FROM');
    const appUrl = this.config.get<string>('APP_PUBLIC_URL') || 'http://localhost:3000';
    const resetUrl = `${appUrl}/reset-password?token=${encodeURIComponent(token)}`;

    await this.transport.sendMail({
      from,
      to: email,
      subject: 'Восстановление пароля',
      text: `Сбросить пароль: ${resetUrl}`
    });
  }
}