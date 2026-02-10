import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddToLibraryDto } from './dto/add-to-library.dto';
import { UpdateLibraryItemDto } from './dto/update-library-item.dto';
import { LogReadingDto } from './dto/log-reading.dto';
import { LibraryService } from './library.service';

@Controller('library')
@UseGuards(JwtAuthGuard)
export class LibraryController {
  constructor(private readonly library: LibraryService) {}

  @Get()
  async list(
    @CurrentUser() user: { id: string },
    @Query('status') status?: string
  ) {
    return this.library.list(user.id, status);
  }

  @Post()
  async add(@CurrentUser() user: { id: string }, @Body() dto: AddToLibraryDto) {
    return this.library.add(user.id, dto);
  }

  @Patch(':workId')
  async update(
    @CurrentUser() user: { id: string },
    @Param('workId') workId: string,
    @Body() dto: UpdateLibraryItemDto
  ) {
    return this.library.update(user.id, workId, dto);
  }

  @Post('log')
  async log(@CurrentUser() user: { id: string }, @Body() dto: LogReadingDto) {
    return this.library.logReading(user.id, dto);
  }
}