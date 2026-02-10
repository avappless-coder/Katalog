import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { GenresService } from './genres.service';
import { CreateGenreRequestDto } from './dto/create-genre-request.dto';

@Controller('genres')
export class GenresController {
  constructor(private readonly genres: GenresService) {}

  @Get()
  async list() {
    return this.genres.list();
  }

  @Post('request')
  @UseGuards(JwtAuthGuard)
  async request(@CurrentUser() user: { id: string }, @Body() dto: CreateGenreRequestDto) {
    return this.genres.request(user.id, dto);
  }
}