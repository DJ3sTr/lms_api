type Match = {
    MatchNumber: number;
    RoundNumber: number;
    DateUtc: string;
    Location: string;
    HomeTeam: string;
    AwayTeam: string;
    Group: null | string; // Depending on whether Group can be null or a string
    HomeTeamScore: number;
    AwayTeamScore: number;
  };