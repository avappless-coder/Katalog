import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { FriendshipStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FriendsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string) {
    const friends = await this.prisma.friendship.findMany({
      where: {
        status: FriendshipStatus.ACCEPTED,
        OR: [{ requesterId: userId }, { addresseeId: userId }]
      },
      include: {
        requester: { include: { profile: true } },
        addressee: { include: { profile: true } }
      }
    });

    return friends.map((f) => {
      const other = f.requesterId === userId ? f.addressee : f.requester;
      return {
        id: f.id,
        user: {
          id: other.id,
          displayName: other.profile?.displayName,
          avatarUrl: other.profile?.avatarUrl
        }
      };
    });
  }

  async requests(userId: string) {
    const incoming = await this.prisma.friendship.findMany({
      where: { addresseeId: userId, status: FriendshipStatus.PENDING },
      include: { requester: { include: { profile: true } } },
      orderBy: { createdAt: 'desc' }
    });

    return incoming.map((r) => ({
      id: r.id,
      from: {
        id: r.requester.id,
        displayName: r.requester.profile?.displayName,
        avatarUrl: r.requester.profile?.avatarUrl
      },
      createdAt: r.createdAt
    }));
  }

  async request(requesterId: string, addresseeId: string) {
    if (requesterId === addresseeId) {
      throw new BadRequestException('Cannot add yourself');
    }

    const exists = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId, addresseeId },
          { requesterId: addresseeId, addresseeId: requesterId }
        ]
      }
    });

    if (exists) {
      throw new BadRequestException('Friendship already exists');
    }

    const record = await this.prisma.friendship.create({
      data: { requesterId, addresseeId, status: FriendshipStatus.PENDING }
    });

    return { requestId: record.id };
  }

  async respond(userId: string, requestId: string, status: FriendshipStatus) {
    if (status !== FriendshipStatus.ACCEPTED && status !== FriendshipStatus.DECLINED) {
      throw new BadRequestException('Invalid status');
    }

    const record = await this.prisma.friendship.findUnique({ where: { id: requestId } });
    if (!record) throw new NotFoundException('Request not found');
    if (record.addresseeId !== userId) {
      throw new BadRequestException('Not allowed');
    }

    const updated = await this.prisma.friendship.update({
      where: { id: requestId },
      data: { status, respondedAt: new Date() }
    });

    return { id: updated.id, status: updated.status };
  }
}