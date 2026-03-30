export interface TeamResponse {
  id: string;
  name: string;
  fullName: string;
  colorPrimary: string;
  colorSecondary: string | null;
  base: string | null;
  teamPrincipal: string | null;
  engine: string;
  firstSeason: number | null;
  championships: number;
  wins: number;
  podiums: number;
  bio: string | null;
  drivers: TeamDriverSummary[];
}

export interface TeamDriverSummary {
  id: string;
  firstName: string;
  lastName: string;
  abbreviation: string;
  number: number;
  nationality: string;
}

export interface TeamListItem {
  id: string;
  name: string;
  fullName: string;
  colorPrimary: string;
  engine: string;
  championships: number;
  wins: number;
  driverCount: number;
}
