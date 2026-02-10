import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionsGuard } from '../../rbac/permissions.guard';
import { RequirePermissions } from '../../rbac/permissions.decorator';
import { AdminWorksService } from './works.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';

@Controller('admin/works')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AdminWorksController {
  constructor(private readonly works: AdminWorksService) {}

  @Post()
  @RequirePermissions('works:create')
  async create(@Body() dto: CreateWorkDto) {
    return this.works.create(dto);
  }

  @Patch(':id')
  @RequirePermissions('works:update')
  async update(@Param('id') id: string, @Body() dto: UpdateWorkDto) {
    return this.works.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('works:delete')
  async remove(@Param('id') id: string) {
    return this.works.remove(id);
  }
}