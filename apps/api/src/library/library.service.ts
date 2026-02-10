import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { LibraryStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AchievementsService } from '../achievements/achievements.service';
import { AddToLibraryDto } from './dto/add-to-library.dto';
import { UpdateLibraryItemDto } from './dto/update-library-item.dto';
import { LogReadingDto } from './dto/log-reading.dto';

@Injectable()
export class LibraryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly achievements: AchievementsService
  ) {}

  async list(userId: string, status?: string) {
    const items = await this.prisma.userLibraryItem.findMany({
      where: {
        userId,
        status: status as any
      },
      include: {
        work: {
          include: {
            authors: { include: { author: true } },
            genres: { include: { genre: true } }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return items.map((i) => ({
      workId: i.workId,
      status: i.status,
      progressPages: i.progressPages,
      progressChapters: i.progressChapters,
      rating: i.rating,
      notes: i.notes,
      startedAt: i.startedAt,
      finishedAt: i.finishedAt,
      work: {
        id: i.work.id,
        title: i.work.title,
        type: i.work.type,
        coverUrl: i.work.coverUrl,
        totalPages: i.work.totalPages,
        totalChapters: i.work.totalChapters,
        authors: i.work.authors.map((a) => a.author.name),
        genres: i.work.genres.map((g) => g.genre.name)
      }
    }));
  }

  async add(userId: string, dto: AddToLibraryDto) {
    const work = await this.prisma.work.findUnique({ where: { id: dto.workId } });
    if (!work) throw new NotFoundException('Work not found');

    const item = await this.prisma.userLibraryItem.upsert({
      where: { userId_workId: { userId, workId: dto.workId } },
      update: { status: dto.status },
      create: { userId, workId: dto.workId, status: dto.status }
    });

    if (dto.status === LibraryStatus.READING && !item.startedAt) {
      await this.prisma.userLibraryItem.update({
        where: { userId_workId: { userId, workId: dto.workId } },
        data: { startedAt: new Date() }
      });
    }

    return { item };
  }

  async update(userId: string, workId: string, dto: UpdateLibraryItemDto) {
    const existing = await this.prisma.userLibraryItem.findUnique({
      where: { userId_workId: { userId, workId } },
      include: { work: true }
    });
    if (!existing) throw new NotFoundException('Library item not found');

    const progressPages = this.clampProgress(dto.progressPages, existing.work.totalPages);
    const progressChapters = this.clampProgress(dto.progressChapters, existing.work.totalChapters);

    const status = dto.status ?? existing.status;
    const isCompleting = status === LibraryStatus.COMPLETED && existing.status !== status;

    const item = await this.prisma.userLibraryItem.update({
      where: { userId_workId: { userId, workId } },
      data: {
        status,
        progressPages: progressPages ?? existing.progressPages,
        progressChapters: progressChapters ?? existing.progressChapters,
        rating: dto.rating ?? existing.rating,
        notes: dto.notes ?? existing.notes,
        startedAt: status === LibraryStatus.READING ? existing.startedAt ?? new Date() : existing.startedAt,
        finishedAt: status === LibraryStatus.COMPLETED ? new Date() : existing.finishedAt
      }
    });

    if (isCompleting) {
      await this.achievements.recalculateForUser(userId);
    }

    return { item };
  }

  async logReading(userId: string, dto: LogReadingDto) {
    const libraryItem = await this.prisma.userLibraryItem.findUnique({
      where: { userId_workId: { userId, workId: dto.workId } },
      include: { work: true }
    });
    if (!libraryItem) throw new NotFoundException('Library item not found');

    const date = this.normalizeDate(dto.date);

    const existingLog = await this.prisma.readingLog.findUnique({
      where: { userId_workId_date: { userId, workId: dto.workId, date } }
    });

    const newPages = dto.pagesRead ?? 0;
    const newChapters = dto.chaptersRead ?? 0;

    const prevPages = existingLog?.pagesRead ?? 0;
    const prevChapters = existingLog?.chaptersRead ?? 0;

    const deltaPages = newPages - prevPages;
    const deltaChapters = newChapters - prevChapters;

    const updatedPages = this.clampProgress(
      (libraryItem.progressPages ?? 0) + deltaPages,
      libraryItem.work.totalPages
    );

    const updatedChapters = this.clampProgress(
      (libraryItem.progressChapters ?? 0) + deltaChapters,
      libraryItem.work.totalChapters
    );

    if (updatedPages !== null && updatedPages < 0) {
      throw new BadRequestException('Invalid pages progress');
    }
    if (updatedChapters !== null && updatedChapters < 0) {
      throw new BadRequestException('Invalid chapters progress');
    }

    const isCompletedByPages =
      updatedPages !== null && libraryItem.work.totalPages && updatedPages >= libraryItem.work.totalPages;
    const isCompletedByChapters =
      updatedChapters !== null && libraryItem.work.totalChapters && updatedChapters >= libraryItem.work.totalChapters;

    const shouldComplete = isCompletedByPages || isCompletedByChapters;

    const [log, item] = await this.prisma.$transaction([
      this.prisma.readingLog.upsert({
        where: { userId_workId_date: { userId, workId: dto.workId, date } },
        update: { pagesRead: newPages, chaptersRead: newChapters },
        create: {
          userId,
          workId: dto.workId,
          date,
          pagesRead: newPages,
          chaptersRead: newChapters
        }
      }),
      this.prisma.userLibraryItem.update({
        where: { userId_workId: { userId, workId: dto.workId } },
        data: {
          progressPages: updatedPages ?? libraryItem.progressPages,
          progressChapters: updatedChapters ?? libraryItem.progressChapters,
          status: shouldComplete ? LibraryStatus.COMPLETED : libraryItem.status,
          finishedAt: shouldComplete ? new Date() : libraryItem.finishedAt,
          startedAt: libraryItem.startedAt ?? new Date()
        }
      })
    ]);

    if (shouldComplete) {
      await this.achievements.recalculateForUser(userId);
    }

    return { log, item };
  }

  private clampProgress(value: number | undefined, total: number | null) {
    if (value === undefined) return null;
    if (!total) return Math.max(0, value);
    return Math.min(Math.max(0, value), total);
  }

  private normalizeDate(input: string) {
    const date = new Date(input);
    if (Number.isNaN(date.getTime())) throw new BadRequestException('Invalid date');
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  }
}