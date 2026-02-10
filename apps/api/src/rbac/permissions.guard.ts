import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!required || required.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as { id: string } | undefined;

    if (!user) return false;

    const roles = await this.prisma.userRole.findMany({
      where: { userId: user.id },
      include: { role: { include: { permissions: { include: { permission: true } } } } }
    });

    const permissions = new Set(
      roles.flatMap((r) => r.role.permissions.map((p) => p.permission.key))
    );

    const ok = required.every((p) => permissions.has(p));

    if (!ok) throw new ForbiddenException('Insufficient permissions');

    return true;
  }
}