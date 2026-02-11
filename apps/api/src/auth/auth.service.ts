import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Request, Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly mailer: MailerService
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new UnauthorizedException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const requireVerification =
      (this.config.get<string>('EMAIL_VERIFICATION_REQUIRED') || 'true') === 'true';
    const fallbackName = dto.email.split('@')[0] ?? dto.email;
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        emailVerifiedAt: requireVerification ? null : new Date(),
        profile: { create: { displayName: dto.displayName || fallbackName } },
        privacy: { create: {} }
      }
    });

    if (requireVerification) {
      const token = this.generateRandomToken();
      await this.prisma.emailVerificationToken.create({
        data: {
          userId: user.id,
          tokenHash: this.hashToken(token),
          expiresAt: this.addHours(24)
        }
      });

      await this.mailer.sendEmailVerification(user.email, token);
    }

    return { id: user.id, email: user.email, emailVerificationRequired: requireVerification };
  }

  async verifyEmail(token: string) {
    const tokenHash = this.hashToken(token);
    const record = await this.prisma.emailVerificationToken.findFirst({
      where: { tokenHash, usedAt: null, expiresAt: { gt: new Date() } }
    });
    if (!record) throw new UnauthorizedException('Invalid token');

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record.userId },
        data: { emailVerifiedAt: new Date() }
      }),
      this.prisma.emailVerificationToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() }
      })
    ]);

    return { ok: true };
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    const requireVerification =
      (this.config.get<string>('EMAIL_VERIFICATION_REQUIRED') || 'true') === 'true';

    if (!user || (requireVerification && !user.emailVerifiedAt) || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const { accessToken, refreshToken, refreshTokenId } = await this.issueTokens(user.id);

    this.setAuthCookies(res, accessToken, refreshToken);

    return { id: user.id, email: user.email, refreshTokenId };
  }

  async refresh(req: Request, res: Response) {
    const token = this.extractCookieToken(req, 'refresh_token');
    if (!token) throw new UnauthorizedException('Missing refresh token');

    const payload = await this.jwt.verifyAsync<{ sub: string; jti: string }>(token, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET')
    });

    const tokenHash = this.hashToken(token);
    const stored = await this.prisma.refreshToken.findFirst({
      where: { tokenHash, revokedAt: null, expiresAt: { gt: new Date() } }
    });
    if (!stored) throw new UnauthorizedException('Invalid refresh token');

    const { accessToken, refreshToken, refreshTokenId } = await this.issueTokens(payload.sub, stored.id);

    this.setAuthCookies(res, accessToken, refreshToken);

    return { ok: true, refreshTokenId };
  }

  async logout(req: Request, res: Response) {
    const token = this.extractCookieToken(req, 'refresh_token');
    if (token) {
      const tokenHash = this.hashToken(token);
      await this.prisma.refreshToken.updateMany({
        where: { tokenHash, revokedAt: null },
        data: { revokedAt: new Date() }
      });
    }

    this.clearAuthCookies(res);
    return { ok: true };
  }

  async requestPasswordReset(dto: RequestPasswordResetDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (user) {
      const token = this.generateRandomToken();
      await this.prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash: this.hashToken(token),
          expiresAt: this.addHours(2)
        }
      });

      await this.mailer.sendPasswordReset(user.email, token);
    }

    return { ok: true };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = this.hashToken(dto.token);
    const record = await this.prisma.passwordResetToken.findFirst({
      where: { tokenHash, usedAt: null, expiresAt: { gt: new Date() } }
    });
    if (!record) throw new UnauthorizedException('Invalid token');

    const passwordHash = await bcrypt.hash(dto.newPassword, 12);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash }
      }),
      this.prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() }
      })
    ]);

    return { ok: true };
  }

  private async issueTokens(userId: string, revokeTokenId?: string) {
    const accessToken = await this.jwt.signAsync(
      { sub: userId },
      {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get<string>('JWT_ACCESS_TTL') || '15m'
      }
    );

    const refreshToken = await this.jwt.signAsync(
      { sub: userId, jti: crypto.randomUUID() },
      {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get<string>('JWT_REFRESH_TTL') || '30d'
      }
    );

    const refreshTokenHash = this.hashToken(refreshToken);
    const refreshRecord = await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: refreshTokenHash,
        expiresAt: this.addDays(30)
      }
    });

    if (revokeTokenId) {
      await this.prisma.refreshToken.update({
        where: { id: revokeTokenId },
        data: { revokedAt: new Date(), replacedByTokenId: refreshRecord.id }
      });
    }

    return { accessToken, refreshToken, refreshTokenId: refreshRecord.id };
  }

  private setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    const domain = this.config.get<string>('COOKIE_DOMAIN') || 'localhost';
    const secure = this.config.get<string>('COOKIE_SECURE') === 'true';

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      domain
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      domain
    });
  }

  private clearAuthCookies(res: Response) {
    const domain = this.config.get<string>('COOKIE_DOMAIN') || 'localhost';
    res.clearCookie('access_token', { domain });
    res.clearCookie('refresh_token', { domain });
  }

  private extractCookieToken(req: Request, name: string): string | null {
    const value = req.cookies?.[name];
    return value || null;
  }

  private generateRandomToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  private hashToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private addHours(hours: number) {
    return new Date(Date.now() + hours * 60 * 60 * 1000);
  }

  private addDays(days: number) {
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }
}
