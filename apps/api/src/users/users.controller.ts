import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePrivacyDto } from './dto/update-privacy.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  async me(@CurrentUser() user: { id: string }) {
    return this.users.getMe(user.id);
  }

  @Patch('me/profile')
  async updateProfile(
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateProfileDto
  ) {
    return this.users.updateProfile(user.id, dto);
  }

  @Patch('me/privacy')
  async updatePrivacy(
    @CurrentUser() user: { id: string },
    @Body() dto: UpdatePrivacyDto
  ) {
    return this.users.updatePrivacy(user.id, dto);
  }
}