import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailerModule } from './mailer/mailer.module';
import { AppController } from './app.controller';
import { WorksModule } from './works/works.module';
import { LibraryModule } from './library/library.module';
import { FriendsModule } from './friends/friends.module';
import { AchievementsModule } from './achievements/achievements.module';
import { RbacModule } from './rbac/rbac.module';
import { AdminWorksModule } from './admin/works/works.module';
import { AdminUsersModule } from './admin/users/users.module';
import { GenresModule } from './genres/genres.module';
import { AdminGenresModule } from './admin/genres/genres.module';
import { QuotesModule } from './quotes/quotes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    ThrottlerModule.forRoot([{
      ttl: 60_000,
      limit: 120
    }]),
    PrismaModule,
    MailerModule,
    AuthModule,
    UsersModule,
    WorksModule,
    LibraryModule,
    FriendsModule,
    AchievementsModule,
    RbacModule,
    AdminWorksModule,
    AdminUsersModule,
    GenresModule,
    AdminGenresModule,
    QuotesModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {}
