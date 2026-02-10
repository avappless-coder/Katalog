import { Module } from '@nestjs/common';
import { AdminGenresController } from './genres.controller';
import { AdminGenresService } from './genres.service';

@Module({
  controllers: [AdminGenresController],
  providers: [AdminGenresService]
})
export class AdminGenresModule {}