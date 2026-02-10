import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AchievementsService } from './achievements.service';

@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievements: AchievementsService) {}

  @Get()
  async listAll() {
    return this.achievements.listAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async listMine(@CurrentUser() user: { id: string }) {
    return this.achievements.listForUser(user.id);
  }
}