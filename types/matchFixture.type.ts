type MatchFixture = {
    week: number;
    date: Date;
    home: string;
    away: string;
    type: 'fixture' | 'result';
    homeScore?: number;
    awayScore?: number;
}