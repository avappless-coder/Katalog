import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateGenreRequestDto {
  @IsString()
  @MaxLength(80)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}