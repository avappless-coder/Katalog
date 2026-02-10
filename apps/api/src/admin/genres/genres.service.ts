import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { GenreRequestStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminGenresService {
  constructor(private readonly prisma: PrismaService) {}

  async listRequests() {
    return this.prisma.genreRequest.findMany({
      include: { user: { include: { profile: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async review(id: string, status: GenreRequestStatus) {
    if (status !== GenreRequestStatus.APPROVED && status !== GenreRequestStatus.REJECTED) {
      throw new BadRequestException('Invalid status');
    }

    const request = await this.prisma.genreRequest.findUnique({ where: { id } });
    if (!request) throw new NotFoundException('Request not found');
    if (request.status !== GenreRequestStatus.PENDING) {
      throw new BadRequestException('Request already reviewed');
    }

    const updated = await this.prisma.genreRequest.update({
      where: { id },
      data: { status, reviewedAt: new Date() }
    });

    if (status === GenreRequestStatus.APPROVED) {
      const exists = await this.prisma.genre.findFirst({
        where: { name: { equals: request.name, mode: 'insensitive' } }
      });
      if (!exists) {
        await this.prisma.genre.create({ data: { name: request.name } });
      }
    }

    return { id: updated.id, status: updated.status };
  }
}