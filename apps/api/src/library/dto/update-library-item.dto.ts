import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { LibraryStatus } from '@prisma/client';

export class UpdateLibraryItemDto {
  @IsOptional()
  @IsEnum(LibraryStatus)
  status?: LibraryStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  progressPages?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  progressChapters?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  rating?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}