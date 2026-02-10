import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FriendRequestDto } from './dto/friend-request.dto';
import { RespondFriendRequestDto } from './dto/respond-friend-request.dto';
import { FriendsService } from './friends.service';

@Controller('friends')
@UseGuards(JwtAuthGuard)
export class FriendsController {
  constructor(private readonly friends: FriendsService) {}

  @Get()
  async list(@CurrentUser() user: { id: string }) {
    return this.friends.list(user.id);
  }

  @Get('requests')
  async requests(@CurrentUser() user: { id: string }) {
    return this.friends.requests(user.id);
  }

  @Post('request')
  async request(@CurrentUser() user: { id: string }, @Body() dto: FriendRequestDto) {
    return this.friends.request(user.id, dto.userId);
  }

  @Patch('request/:id')
  async respond(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
    @Body() dto: RespondFriendRequestDto
  ) {
    return this.friends.respond(user.id, id, dto.status);
  }
}