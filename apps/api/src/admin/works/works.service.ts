import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';

@Injectable()
export class AdminWorksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateWorkDto) {
    const authors = this.normalizeList(dto.authors);
    const genres = this.normalizeList(dto.genres);

    if (!authors.length || !genres.length) {
      throw new BadRequestException('Authors and genres are required');
    }

    const authorRecords = await Promise.all(authors.map((name) => this.upsertAuthor(name)));
    const genreRecords = await Promise.all(genres.map((name) => this.upsertGenre(name)));

    const work = await this.prisma.work.create({
      data: {
        title: dto.title.trim(),
        description: dto.description?.trim(),
        type: dto.type,
        totalPages: dto.totalPages,
        totalChapters: dto.totalChapters,
        releaseYear: dto.releaseYear,
        language: dto.language?.trim(),
        coverUrl: dto.coverUrl?.trim(),
        authors: {
          create: authorRecords.map((a) => ({ authorId: a.id }))
        },
        genres: {
          create: genreRecords.map((g) => ({ genreId: g.id }))
        }
      }
    });

    return { id: work.id };
  }

  async update(id: string, dto: UpdateWorkDto) {
    const existing = await this.prisma.work.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Work not found');

    const data: any = {
      title: dto.title?.trim(),
      description: dto.description?.trim(),
      type: dto.type,
      totalPages: dto.totalPages,
      totalChapters: dto.totalChapters,
      releaseYear: dto.releaseYear,
      language: dto.language?.trim(),
      coverUrl: dto.coverUrl?.trim()
    };

    if (dto.authors) {
      const authors = this.normalizeList(dto.authors);
      const authorRecords = await Promise.all(authors.map((name) => this.upsertAuthor(name)));
      data.authors = {
        deleteMany: {},
        create: authorRecords.map((a) => ({ authorId: a.id }))
      };
    }

    if (dto.genres) {
      const genres = this.normalizeList(dto.genres);
      const genreRecords = await Promise.all(genres.map((name) => this.upsertGenre(name)));
      data.genres = {
        deleteMany: {},
        create: genreRecords.map((g) => ({ genreId: g.id }))
      };
    }

    const work = await this.prisma.work.update({ where: { id }, data });

    return { id: work.id };
  }

  async remove(id: string) {
    const existing = await this.prisma.work.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Work not found');

    await this.prisma.work.delete({ where: { id } });
    return { ok: true };
  }

  private normalizeList(items: string[]) {
    return items
      .map((i) => i.trim())
      .filter((i) => i.length > 0)
      .map((i) => i.toLowerCase());
  }

  private async upsertAuthor(name: string) {
    const existing = await this.prisma.author.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } }
    });
    if (existing) return existing;

    return this.prisma.author.create({ data: { name } });
  }

  private async upsertGenre(name: string) {
    const existing = await this.prisma.genre.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } }
    });
    if (existing) return existing;

    return this.prisma.genre.create({ data: { name } });
  }
}