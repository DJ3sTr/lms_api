import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
// Import Axios
import TEAMS from '@/data/teams.json';
import { MatchesService } from '../matches/matches.service';
import { StatsService } from '../stats/stats.service';

const TeamData = TEAMS as TeamDetails[];



@Injectable()
export class TeamService {
	constructor(private matchesService: MatchesService, private statsService: StatsService) { }


	// create(createTeamDto: CreateTeamDto) {
	//   return 'This action adds a new team';
	// }

	findAll() {
		return `This action returns all team`;
	}

	async findOne(id: string) {
		Logger.log(`Searching for team details for: ${id}.`);
		const matchData = await this.matchesService.fetchData();
		// console.log(TeamData)
		let teamArray: any[];

		// Check if TEAMS is an array
		// if (Array.isArray(TEAMS)) {
		// 	teamArray = TEAMS;
		// } else if ('default' in TEAMS) {
		// 	// Check if TEAMS has a 'default' property
		// 	teamArray = TEAMS.default;
		// } else {
		// 	throw new Error('Invalid TEAMS structure');
		// }
		const team = TeamData.find(x => x.id === id);
		if (!team) throw new HttpException('Invalid Team ID', HttpStatus.BAD_REQUEST);

		const matches = matchData.filter((match) => {
			return (match.HomeTeam === team.alias || match.AwayTeam === team.alias);
		});
		// console.log(matches)

		const stats = await this.statsService.findOne(id);
		console.log(stats)


		return {
			
			...stats,
			matches: matches.map((match: Match) => {
				const home = TeamData.find(x => x.alias === match.HomeTeam)?.id ?? 'Error';
				const away = TeamData.find(x => x.alias === match.AwayTeam)?.id ?? 'Error';
				let refinedMatch: MatchFixture = {
					week: match.RoundNumber,
					date: new Date(match.DateUtc),
					type: 'fixture',
					home,
					away,
				}

				if (match.HomeTeamScore !== null) {
					refinedMatch = {
						...refinedMatch,
						type: 'result',
						homeScore: match.HomeTeamScore,
						awayScore: match.AwayTeamScore,
					}
				}
				return refinedMatch;
			}
			)
		}
	}

	// update(id: string, updateTeamDto: UpdateTeamDto) {
	//   return `This action updates a #${id} team`;
	// }

	remove(id: string) {
		return `This action removes a #${id} team`;
	}
}
