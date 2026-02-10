import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class LogReadingDto {
  @IsString()
  workId!: string;

  @IsDateString()
  date!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  pagesRead?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  chaptersRead?: number;
}