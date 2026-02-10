import { IsEnum } from 'class-validator';
import { FriendshipStatus } from '@prisma/client';

export class RespondFriendRequestDto {
  @IsEnum(FriendshipStatus)
  status!: FriendshipStatus;
}