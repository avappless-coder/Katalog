import { IsEnum, IsString } from 'class-validator';
import { LibraryStatus } from '@prisma/client';

export class AddToLibraryDto {
  @IsString()
  workId!: string;

  @IsEnum(LibraryStatus)
  status!: LibraryStatus;
}