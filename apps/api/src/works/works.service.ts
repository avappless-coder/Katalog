import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorksService {
  constructor(private readonly prisma: PrismaService) {}

  async list(filters: { q?: string; type?: string; genre?: string }) {
    const where: any = {};

    if (filters.q) {
      where.title = { contains: filters.q, mode: 'insensitive' };
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.genre) {
      where.genres = {
        some: {
          genre: {
            name: { equals: filters.genre, mode: 'insensitive' }
          }
        }
      };
    }

    const items = await this.prisma.work.findMany({
      where,
      include: {
        authors: { include: { author: true } },
        genres: { include: { genre: true } }
      },
      orderBy: { title: 'asc' }
    });

    return items.map((w) => ({
      id: w.id,
      title: w.title,
      description: w.description,
      type: w.type,
      totalPages: w.totalPages,
      totalChapters: w.totalChapters,
      releaseYear: w.releaseYear,
      language: w.language,
      coverUrl: w.coverUrl,
      authors: w.authors.map((a) => a.author.name),
      genres: w.genres.map((g) => g.genre.name)
    }));
  }

  async getById(id: string) {
    const w = await this.prisma.work.findUnique({
      where: { id },
      include: {
        authors: { include: { author: true } },
        genres: { include: { genre: true } }
      }
    });
    if (!w) throw new NotFoundException('Work not found');

    return {
      id: w.id,
      title: w.title,
      description: w.description,
      type: w.type,
      totalPages: w.totalPages,
      totalChapters: w.totalChapters,
      releaseYear: w.releaseYear,
      language: w.language,
      coverUrl: w.coverUrl,
      authors: w.authors.map((a) => a.author.name),
      genres: w.genres.map((g) => g.genre.name)
    };
  }
}