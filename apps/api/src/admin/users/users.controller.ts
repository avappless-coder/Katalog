import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionsGuard } from '../../rbac/permissions.guard';
import { RequirePermissions } from '../../rbac/permissions.decorator';
import { AdminUsersService } from './users.service';
import { UpdateUserRolesDto } from './dto/update-user-roles.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AdminUsersController {
  constructor(private readonly users: AdminUsersService) {}

  @Get()
  @RequirePermissions('users:read')
  async list() {
    return this.users.list();
  }

  @Get(':id')
  @RequirePermissions('users:read')
  async get(@Param('id') id: string) {
    return this.users.getById(id);
  }

  @Patch(':id/status')
  @RequirePermissions('users:update')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateUserStatusDto) {
    return this.users.updateStatus(id, dto.status);
  }

  @Patch(':id/roles')
  @RequirePermissions('roles:assign')
  async updateRoles(@Param('id') id: string, @Body() dto: UpdateUserRolesDto) {
    return this.users.updateRoles(id, dto.roles);
  }
}