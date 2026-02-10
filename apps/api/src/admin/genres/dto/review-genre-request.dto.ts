import { IsEnum } from 'class-validator';
import { GenreRequestStatus } from '@prisma/client';

export class ReviewGenreRequestDto {
  @IsEnum(GenreRequestStatus)
  status!: GenreRequestStatus;
}