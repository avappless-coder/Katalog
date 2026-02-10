import { Module } from '@nestjs/common';
import { AdminWorksController } from './works.controller';
import { AdminWorksService } from './works.service';

@Module({
  controllers: [AdminWorksController],
  providers: [AdminWorksService]
})
export class AdminWorksModule {}