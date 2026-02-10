import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserStatus } from '@prisma/client';

@Injectable()
export class AdminUsersService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    const users = await this.prisma.user.findMany({
      include: { profile: true, roles: { include: { role: true } } },
      orderBy: { createdAt: 'desc' }
    });

    return users.map((u) => ({
      id: u.id,
      email: u.email,
      status: u.status,
      emailVerifiedAt: u.emailVerifiedAt,
      profile: u.profile,
      roles: u.roles.map((r) => r.role.name),
      createdAt: u.createdAt
    }));
  }

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { profile: true, roles: { include: { role: true } } }
    });
    if (!user) throw new NotFoundException('User not found');

    return {
      id: user.id,
      email: user.email,
      status: user.status,
      emailVerifiedAt: user.emailVerifiedAt,
      profile: user.profile,
      roles: user.roles.map((r) => r.role.name),
      createdAt: user.createdAt
    };
  }

  async updateStatus(id: string, status: UserStatus) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const updated = await this.prisma.user.update({ where: { id }, data: { status } });
    return { id: updated.id, status: updated.status };
  }

  async updateRoles(id: string, roles: string[]) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const roleRecords = await this.prisma.role.findMany({
      where: { name: { in: roles } }
    });

    if (roleRecords.length !== roles.length) {
      throw new BadRequestException('Some roles not found');
    }

    await this.prisma.userRole.deleteMany({ where: { userId: id } });

    await this.prisma.userRole.createMany({
      data: roleRecords.map((r) => ({ userId: id, roleId: r.id }))
    });

    return { ok: true };
  }
}