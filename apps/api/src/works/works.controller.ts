import { Controller, Get, Param, Query } from '@nestjs/common';
import { WorksService } from './works.service';

@Controller('works')
export class WorksController {
  constructor(private readonly works: WorksService) {}

  @Get()
  async list(
    @Query('q') q?: string,
    @Query('type') type?: string,
    @Query('genre') genre?: string
  ) {
    return this.works.list({ q, type, genre });
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.works.getById(id);
  }
}