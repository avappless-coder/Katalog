import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionsGuard } from '../../rbac/permissions.guard';
import { RequirePermissions } from '../../rbac/permissions.decorator';
import { AdminGenresService } from './genres.service';
import { ReviewGenreRequestDto } from './dto/review-genre-request.dto';

@Controller('admin/genres')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AdminGenresController {
  constructor(private readonly genres: AdminGenresService) {}

  @Get('requests')
  @RequirePermissions('genres:review')
  async listRequests() {
    return this.genres.listRequests();
  }

  @Patch('requests/:id')
  @RequirePermissions('genres:review')
  async review(@Param('id') id: string, @Body() dto: ReviewGenreRequestDto) {
    return this.genres.review(id, dto.status);
  }
}