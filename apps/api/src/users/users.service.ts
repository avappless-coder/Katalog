import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePrivacyDto } from './dto/update-privacy.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, privacy: true, roles: { include: { role: true } } }
    });
    if (!user) throw new NotFoundException('User not found');

    return {
      id: user.id,
      email: user.email,
      emailVerifiedAt: user.emailVerifiedAt,
      status: user.status,
      profile: user.profile,
      privacy: user.privacy,
      roles: user.roles.map((r) => r.role.name)
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });
    if (!user) throw new NotFoundException('User not found');

    const displayName =
      dto.displayName ?? user.profile?.displayName ?? user.email.split('@')[0];

    const profile = await this.prisma.profile.upsert({
      where: { userId },
      update: {
        displayName,
        avatarUrl: dto.avatarUrl ?? null,
        bio: dto.bio ?? null
      },
      create: {
        userId,
        displayName,
        avatarUrl: dto.avatarUrl ?? null,
        bio: dto.bio ?? null
      }
    });

    return { profile };
  }

  async updatePrivacy(userId: string, dto: UpdatePrivacyDto) {
    const privacy = await this.prisma.privacySettings.upsert({
      where: { userId },
      update: {
        profileVisibility: dto.profileVisibility,
        libraryVisibility: dto.libraryVisibility,
        quotesVisibility: dto.quotesVisibility,
        activityVisibility: dto.activityVisibility
      },
      create: {
        userId,
        profileVisibility: dto.profileVisibility,
        libraryVisibility: dto.libraryVisibility,
        quotesVisibility: dto.quotesVisibility,
        activityVisibility: dto.activityVisibility
      }
    });

    return { privacy };
  }
}