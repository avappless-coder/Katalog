import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGenreRequestDto } from './dto/create-genre-request.dto';

@Injectable()
export class GenresService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    return this.prisma.genre.findMany({ orderBy: { name: 'asc' } });
  }

  async request(userId: string, dto: CreateGenreRequestDto) {
    const name = dto.name.trim();

    const exists = await this.prisma.genre.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } }
    });
    if (exists) throw new BadRequestException('Genre already exists');

    const pending = await this.prisma.genreRequest.findFirst({
      where: { name: { equals: name, mode: 'insensitive' }, status: 'PENDING' }
    });
    if (pending) throw new BadRequestException('Genre request already pending');

    const request = await this.prisma.genreRequest.create({
      data: {
        userId,
        name,
        description: dto.description?.trim()
      }
    });

    return { id: request.id };
  }
}