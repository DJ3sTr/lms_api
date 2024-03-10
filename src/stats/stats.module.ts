import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { MatchesModule } from '../matches/matches.module';

@Module({
  imports: [MatchesModule],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService]
})
export class StatsModule {}
