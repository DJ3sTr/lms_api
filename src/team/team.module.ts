import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { MatchesModule } from '../matches/matches.module';
import { StatsModule } from '../stats/stats.module';

@Module({
  imports: [MatchesModule, StatsModule],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService]
})
export class TeamModule {}
