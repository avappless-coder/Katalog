import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateGlobalQuoteDto {
  @IsString()
  @MaxLength(2000)
  text!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  author?: string;

  @IsOptional()
  @IsString()
  workId?: string;
}