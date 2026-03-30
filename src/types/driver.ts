export interface DriverResponse {
  id: string;
  firstName: string;
  lastName: string;
  abbreviation: string;
  number: number;
  nationality: string;
  dateOfBirth: string | null;
  championships: number;
  wins: number;
  podiums: number;
  poles: number;
  fastestLaps: number;
  firstSeason: number | null;
  team: DriverTeamSummary;
}

export interface DriverTeamSummary {
  id: string;
  name: string;
  colorPrimary: string;
}

export interface DriverListItem {
  id: string;
  firstName: string;
  lastName: string;
  abbreviation: string;
  number: number;
  nationality: string;
  championships: number;
  wins: number;
  podiums: number;
  team: DriverTeamSummary;
}
