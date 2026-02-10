import { Injectable, OnModuleInit } from '@nestjs/common';
import { AchievementRuleType, LibraryStatus, WorkType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type RuleData = {
  count?: number;
  type?: WorkType;
  genre?: string;
  altGenres?: string[];
};

@Injectable()
export class AchievementsService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.ensureDefaults();
  }

  async listAll() {
    return this.prisma.achievement.findMany({ orderBy: { createdAt: 'asc' } });
  }

  async listForUser(userId: string) {
    const [achievements, userAchievements] = await Promise.all([
      this.prisma.achievement.findMany({ orderBy: { createdAt: 'asc' } }),
      this.prisma.userAchievement.findMany({ where: { userId } })
    ]);

    const awarded = new Set(userAchievements.map((a) => a.achievementId));

    return achievements.map((a) => ({
      id: a.id,
      key: a.key,
      title: a.title,
      description: a.description,
      ruleType: a.ruleType,
      ruleData: a.ruleData,
      awarded: awarded.has(a.id)
    }));
  }

  async recalculateForUser(userId: string) {
    const achievements = await this.prisma.achievement.findMany();

    if (!achievements.length) return { awarded: 0 };

    const completedItems = await this.prisma.userLibraryItem.findMany({
      where: { userId, status: LibraryStatus.COMPLETED },
      include: {
        work: {
          include: {
            genres: { include: { genre: true } }
          }
        }
      }
    });

    const completedBooksCount = completedItems.filter((i) => i.work.type === WorkType.BOOK).length;

    const genreCounts = new Map<string, number>();
    for (const item of completedItems) {
      for (const g of item.work.genres) {
        const name = g.genre.name.toLowerCase();
        genreCounts.set(name, (genreCounts.get(name) || 0) + 1);
      }
    }

    const achievementsToAward: string[] = [];

    for (const achievement of achievements) {
      const ruleData = achievement.ruleData as unknown as RuleData;

      if (achievement.ruleType === AchievementRuleType.WORK_COMPLETED) {
        const type = ruleData.type || WorkType.BOOK;
        const count = completedItems.filter((i) => i.work.type === type).length;
        if (count >= 1) achievementsToAward.push(achievement.id);
      }

      if (achievement.ruleType === AchievementRuleType.BOOKS_COMPLETED_COUNT) {
        const count = ruleData.count || 0;
        if (completedBooksCount >= count) achievementsToAward.push(achievement.id);
      }

      if (achievement.ruleType === AchievementRuleType.GENRE_COMPLETED_COUNT) {
        const count = ruleData.count || 0;
        const base = ruleData.genre ? genreCounts.get(ruleData.genre.toLowerCase()) || 0 : 0;
        let total = base;
        if (ruleData.altGenres?.length) {
          for (const g of ruleData.altGenres) {
            total += genreCounts.get(g.toLowerCase()) || 0;
          }
        }

        if (total >= count) achievementsToAward.push(achievement.id);
      }
    }

    if (!achievementsToAward.length) return { awarded: 0 };

    const existing = await this.prisma.userAchievement.findMany({
      where: { userId, achievementId: { in: achievementsToAward } }
    });

    const existingSet = new Set(existing.map((a) => a.achievementId));
    const toCreate = achievementsToAward.filter((id) => !existingSet.has(id));

    if (!toCreate.length) return { awarded: 0 };

    await this.prisma.userAchievement.createMany({
      data: toCreate.map((achievementId) => ({ userId, achievementId }))
    });

    return { awarded: toCreate.length };
  }

  private async ensureDefaults() {
    const defaults = [
      {
        key: 'book_completed_first',
        title: 'Первая книга',
        description: 'Прочитана книга полностью',
        ruleType: AchievementRuleType.WORK_COMPLETED,
        ruleData: { type: WorkType.BOOK }
      },
      {
        key: 'books_completed_10',
        title: 'Книжный марафон',
        description: 'Прочитано 10 книг',
        ruleType: AchievementRuleType.BOOKS_COMPLETED_COUNT,
        ruleData: { type: WorkType.BOOK, count: 10 }
      },
      {
        key: 'books_completed_50',
        title: 'Книжный профи',
        description: 'Прочитано 50 книг',
        ruleType: AchievementRuleType.BOOKS_COMPLETED_COUNT,
        ruleData: { type: WorkType.BOOK, count: 50 }
      },
      {
        key: 'romance_10',
        title: 'Романтик',
        description: 'Прочитано 10 книг жанра романтика',
        ruleType: AchievementRuleType.GENRE_COMPLETED_COUNT,
        ruleData: { genre: 'романтика', count: 10 }
      },
      {
        key: 'fantasy_10',
        title: 'Мечтатель',
        description: 'Прочитано 10 книг жанра фэнтези или фантастики',
        ruleType: AchievementRuleType.GENRE_COMPLETED_COUNT,
        ruleData: { genre: 'фэнтези', altGenres: ['фантастика'], count: 10 }
      }
    ];

    for (const d of defaults) {
      const existing = await this.prisma.achievement.findUnique({ where: { key: d.key } });
      if (!existing) {
        await this.prisma.achievement.create({
          data: {
            key: d.key,
            title: d.title,
            description: d.description,
            ruleType: d.ruleType,
            ruleData: d.ruleData as any
          }
        });
      }
    }
  }
}