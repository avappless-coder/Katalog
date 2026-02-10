import { IsEnum } from 'class-validator';
import { Visibility } from '@prisma/client';

export class UpdatePrivacyDto {
  @IsEnum(Visibility)
  profileVisibility!: Visibility;

  @IsEnum(Visibility)
  libraryVisibility!: Visibility;

  @IsEnum(Visibility)
  quotesVisibility!: Visibility;

  @IsEnum(Visibility)
  activityVisibility!: Visibility;
}