import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TeamModule } from './team/team.module';
import { StatsModule } from './stats/stats.module';
import { MatchesModule } from './matches/matches.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [TeamModule, StatsModule, MatchesModule],
})
export class AppModule {}
