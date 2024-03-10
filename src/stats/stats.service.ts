import { Injectable } from '@nestjs/common';
import TEAMS from '@/data/teams.json';
import { MatchesService } from '../matches/matches.service';

const TeamData = TEAMS as TeamDetails[];

const POINTS_FOR_WIN = 3;
const POINTS_FOR_DRAW = 1;
const POINTS_FOR_LOSE = 0;

@Injectable()
export class StatsService {
  constructor(private matchesService: MatchesService) { }

  findAll() {
    return `This action returns all stats`;
  }

  async findOne(id: string) {
    const tableData = await this.findTableStats();

    const teamStats = tableData.find(x => x.id === id);
    const position = tableData.findIndex(x => x.id === id) + 1;
    console.log(teamStats);
    return { ...teamStats, position };
  }

  async findTableStats() {
    const matchData = await this.matchesService.fetchData() as MatchInfo[];

    const tableData = TeamData.map(team => {
      return {
        position: 0,
        id: team.id,
        alias: team.alias,
        name: team.name,
        played: 0,
        won: 0,
        lost: 0,
        draw: 0,
        points: 0,
        goalsFor: 0,
        goalsAgainst: 0,
      } as TableTeam;
    });

    // console.log(matchData[0])

    const playedMatches = matchData.filter(match => match.HomeTeamScore !== null);

    for (const match of playedMatches) {
      const homeTeam = tableData.find(x => x.alias === match.HomeTeam);
      const awayTeam = tableData.find(x => x.alias === match.AwayTeam);

      if (!homeTeam || !awayTeam) throw new Error(`Unable to load team data for table correctly for match #${match.MatchNumber}`);

      homeTeam.played++;
      homeTeam.goalsFor += match.HomeTeamScore;
      homeTeam.goalsAgainst += match.AwayTeamScore;

      awayTeam.played++;
      awayTeam.goalsFor += match.AwayTeamScore;
      awayTeam.goalsAgainst += match.HomeTeamScore;

      if (match.HomeTeamScore > match.AwayTeamScore) {
        homeTeam.points += POINTS_FOR_WIN;
        homeTeam.won++;
        awayTeam.points += POINTS_FOR_LOSE;
        awayTeam.lost++;
      } else if (match.AwayTeamScore > match.HomeTeamScore) {
        awayTeam.points += POINTS_FOR_WIN;
        awayTeam.won++;
        homeTeam.points += POINTS_FOR_LOSE;
        homeTeam.lost++;
      } else {
        homeTeam.points += POINTS_FOR_DRAW;
        homeTeam.draw++;
        awayTeam.points += POINTS_FOR_DRAW;
        awayTeam.draw++;

      }
    }

    // console.log(playedMatches);


    const sortedTable = tableData.map(x => {
      return {
        ...x,
        goalsDiff: x.goalsFor - x.goalsAgainst
      }
    }).sort((a, b) => {
      if (a.points !== b.points) return b.points - a.points;

      const aGoalDiff = a.goalsFor - a.goalsAgainst;
      const bGoalDiff = b.goalsFor - b.goalsAgainst;

      if (aGoalDiff !== bGoalDiff) return bGoalDiff - aGoalDiff;
      if (a.goalsFor !== b.goalsFor) return b.goalsFor - a.goalsAgainst;

      return a.name.localeCompare(b.name);
    });

    sortedTable.forEach((team, index) => {
      team.position = index + 1;
    });

    console.log(sortedTable);

    return sortedTable;

  }

  // update(id: number, updateStatDto: UpdateStatDto) {
  //   return `This action updates a #${id} stat`;
  // }

  remove(id: number) {
    return `This action removes a #${id} stat`;
  }
}
