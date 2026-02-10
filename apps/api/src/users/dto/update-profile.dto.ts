import { IsOptional, IsString, MaxLength, MinLength, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @MinLength(2)
  @MaxLength(40)
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;
}