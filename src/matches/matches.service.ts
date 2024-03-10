import { Injectable, Logger } from '@nestjs/common';
import TEAMS from '@/data/teams.json';
import axios from 'axios';
import dayjs from 'dayjs';

const TeamData = TEAMS as TeamDetails[];
const hourInMilliseconds = 60 * 60 * 1000;
const refreshRate = 12 * hourInMilliseconds; // 12 Hours

@Injectable()
export class MatchesService {

	private data: MatchInfo[];
	private lastFetched: number;

	async fetchData(): Promise<MatchInfo[]> {
		console.log(Date.now());
		console.log(this.lastFetched)
		console.log(refreshRate)
		const needsRefresh = (Date.now() - this.lastFetched) >= refreshRate;
		console.log(needsRefresh)
		if (!this.data || !this.lastFetched || needsRefresh) {
			console.log(this.data)
			console.log(this.lastFetched)
			if (!this.data || !this.lastFetched)
				Logger.verbose('Fetching Match Data.');
			else
				Logger.verbose('Refreshing Match Data');

			const url = 'https://fixturedownload.com/feed/json/epl-2023';

			try {
				const response = await axios.get(url);
				this.data = response.data;
				this.lastFetched = (new Date()).getTime();
			} catch (error) {
				// Handle errors, e.g., log the error or throw a custom exception
				console.error('Error fetching data:', error.message);
				throw new Error('Failed to fetch data');
			}
		} else {
			Logger.log('Match data still fresh');
		}

		return this.data;
	}

	async findAll() {
		return await this.fetchData();
	}

	findOne(id: number) {
		return `This action returns a #${id} match`;
	}

	async findWeek(id: number) {
		await this.fetchData();
		const filterData = this.data.filter(match => match.RoundNumber === id).sort((a, b) => a.DateUtc.localeCompare(b.DateUtc));
		return filterData.map((match: Match) => {
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
		);
	}

	async findCurrentWeek() {
		const week = await this.findCurrentWeekNumber();
		return await this.findWeek(week);
	}

	async findCurrentWeekNumber() {
		await this.fetchData();
		const today = dayjs().startOf('day');
		const unplayedMatches = this.data.filter((match) => {
			const matchDate = dayjs(match.DateUtc);
			return today.isBefore(matchDate);
		});
		let matchWeek = 38;
		let resultFound = false;
		while (resultFound === false) {
			const firstMatchWeek = unplayedMatches[0].RoundNumber;
			const secondMatchWeek = unplayedMatches[1].RoundNumber;

			if (firstMatchWeek === secondMatchWeek || firstMatchWeek + 1 === secondMatchWeek) {
				matchWeek = firstMatchWeek;
				resultFound = true
			} else {
				unplayedMatches.shift();
			}

			if(unplayedMatches.length === 1){
				resultFound = true;
			}
		}

		console.log(matchWeek)
		return matchWeek

	}

	findTeam(id: string) {
		return `This returns match data for ${id}`;
	}
}
