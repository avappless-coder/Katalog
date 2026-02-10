import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import { MailerService } from './mailer.service';

@Module({
  imports: [ConfigModule],
  providers: [
    MailerService,
    {
      provide: 'MAIL_TRANSPORT',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const host = config.get<string>('SMTP_HOST');
        const port = Number(config.get<string>('SMTP_PORT') || 25);
        const user = config.get<string>('SMTP_USER');
        const pass = config.get<string>('SMTP_PASS');

        return nodemailer.createTransport({
          host,
          port,
          auth: user ? { user, pass } : undefined
        });
      }
    }
  ],
  exports: [MailerService]
})
export class MailerModule {}