import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const DEFAULT_ROLES = ['USER', 'ADMIN', 'SUPER_ADMIN'];
const DEFAULT_PERMISSIONS = [
  { key: 'works:create', description: 'Create works' },
  { key: 'works:update', description: 'Update works' },
  { key: 'works:delete', description: 'Delete works' },
  { key: 'users:read', description: 'Read users' },
  { key: 'users:update', description: 'Update users' },
  { key: 'roles:assign', description: 'Assign roles' },
  { key: 'genres:review', description: 'Review genre requests' }
];

const ROLE_PERMISSIONS: Record<string, string[]> = {
  ADMIN: ['works:create', 'works:update', 'works:delete', 'users:read', 'genres:review'],
  SUPER_ADMIN: [
    'works:create',
    'works:update',
    'works:delete',
    'users:read',
    'users:update',
    'roles:assign',
    'genres:review'
  ]
};

@Injectable()
export class RbacService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.ensureDefaults();
  }

  private async ensureDefaults() {
    for (const roleName of DEFAULT_ROLES) {
      const existing = await this.prisma.role.findUnique({ where: { name: roleName } });
      if (!existing) {
        await this.prisma.role.create({ data: { name: roleName } });
      }
    }

    for (const perm of DEFAULT_PERMISSIONS) {
      const existing = await this.prisma.permission.findUnique({ where: { key: perm.key } });
      if (!existing) {
        await this.prisma.permission.create({ data: perm });
      }
    }

    for (const [roleName, keys] of Object.entries(ROLE_PERMISSIONS)) {
      const role = await this.prisma.role.findUnique({ where: { name: roleName } });
      if (!role) continue;

      for (const key of keys) {
        const permission = await this.prisma.permission.findUnique({ where: { key } });
        if (!permission) continue;

        const existing = await this.prisma.rolePermission.findUnique({
          where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } }
        });

        if (!existing) {
          await this.prisma.rolePermission.create({
            data: { roleId: role.id, permissionId: permission.id }
          });
        }
      }
    }
  }
}