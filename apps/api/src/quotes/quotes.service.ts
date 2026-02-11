import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserQuoteDto } from './dto/create-user-quote.dto';
import { UpdateUserQuoteDto } from './dto/update-user-quote.dto';
import { CreateGlobalQuoteDto } from './dto/create-global-quote.dto';

@Injectable()
export class QuotesService {
  constructor(private readonly prisma: PrismaService) {}

  async listGlobal(sort?: string) {
    const orderBy: Prisma.GlobalQuoteOrderByWithRelationInput =
      sort === 'latest' ? { createdAt: 'desc' } : { likesCount: 'desc' };

    const include = {
      work: true,
      createdBy: { include: { profile: true } }
    } satisfies Prisma.GlobalQuoteInclude;

    const quotes = await this.prisma.globalQuote.findMany({
      include,
      orderBy
    });

    return quotes.map((q) => ({
      id: q.id,
      text: q.text,
      author: q.author,
      likesCount: q.likesCount,
      createdAt: q.createdAt,
      work: q.work
        ? {
            id: q.work.id,
            title: q.work.title,
            type: q.work.type
          }
        : null,
      createdBy: {
        id: q.createdBy.id,
        displayName: q.createdBy.profile?.displayName,
        avatarUrl: q.createdBy.profile?.avatarUrl
      }
    }));
  }

  async createGlobal(userId: string, dto: CreateGlobalQuoteDto) {
    if (dto.workId) {
      const work = await this.prisma.work.findUnique({ where: { id: dto.workId } });
      if (!work) throw new BadRequestException('Work not found');
    }

    const quote = await this.prisma.globalQuote.create({
      data: {
        text: dto.text.trim(),
        author: dto.author?.trim(),
        workId: dto.workId,
        createdById: userId
      }
    });

    return { id: quote.id };
  }

  async like(userId: string, quoteId: string) {
    const quote = await this.prisma.globalQuote.findUnique({ where: { id: quoteId } });
    if (!quote) throw new NotFoundException('Quote not found');

    const existing = await this.prisma.quoteLike.findUnique({
      where: { userId_quoteId: { userId, quoteId } }
    });
    if (existing) return { ok: true };

    await this.prisma.$transaction([
      this.prisma.quoteLike.create({ data: { userId, quoteId } }),
      this.prisma.globalQuote.update({
        where: { id: quoteId },
        data: { likesCount: { increment: 1 } }
      })
    ]);

    return { ok: true };
  }

  async unlike(userId: string, quoteId: string) {
    const existing = await this.prisma.quoteLike.findUnique({
      where: { userId_quoteId: { userId, quoteId } }
    });
    if (!existing) return { ok: true };

    await this.prisma.$transaction([
      this.prisma.quoteLike.delete({ where: { userId_quoteId: { userId, quoteId } } }),
      this.prisma.globalQuote.update({
        where: { id: quoteId },
        data: { likesCount: { decrement: 1 } }
      })
    ]);

    return { ok: true };
  }

  async listUserQuotes(userId: string) {
    return this.prisma.userQuote.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createUserQuote(userId: string, dto: CreateUserQuoteDto) {
    if (dto.workId) {
      const work = await this.prisma.work.findUnique({ where: { id: dto.workId } });
      if (!work) throw new BadRequestException('Work not found');
    }

    const quote = await this.prisma.userQuote.create({
      data: {
        userId,
        text: dto.text.trim(),
        author: dto.author?.trim(),
        workId: dto.workId
      }
    });

    return { id: quote.id };
  }

  async updateUserQuote(userId: string, id: string, dto: UpdateUserQuoteDto) {
    const existing = await this.prisma.userQuote.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      throw new NotFoundException('Quote not found');
    }

    const quote = await this.prisma.userQuote.update({
      where: { id },
      data: {
        text: dto.text?.trim() ?? existing.text,
        author: dto.author?.trim(),
        workId: dto.workId
      }
    });

    return { id: quote.id };
  }

  async deleteUserQuote(userId: string, id: string) {
    const existing = await this.prisma.userQuote.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      throw new NotFoundException('Quote not found');
    }

    await this.prisma.userQuote.delete({ where: { id } });
    return { ok: true };
  }
}