import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { WorkType } from '@prisma/client';

export class CreateWorkDto {
  @IsString()
  @MaxLength(300)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(WorkType)
  type!: WorkType;

  @IsOptional()
  @IsInt()
  @Min(1)
  totalPages?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  totalChapters?: number;

  @IsOptional()
  @IsInt()
  releaseYear?: number;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  coverUrl?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsString({ each: true })
  authors!: string[];

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsString({ each: true })
  genres!: string[];
}