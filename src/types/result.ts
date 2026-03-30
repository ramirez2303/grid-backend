export interface RaceResultItem {
  position: number | null;
  driverId: string;
  firstName: string;
  lastName: string;
  abbreviation: string;
  driverNumber: number;
  teamId: string;
  teamName: string;
  teamColor: string;
  gridPosition: number | null;
  points: number;
  status: string | null;
  time: string | null;
  fastestLap: boolean;
  fastestLapTime: string | null;
}

export interface RaceWithResults {
  season: number;
  round: number;
  name: string;
  circuitName: string;
  country: string;
  date: string;
  results: RaceResultItem[];
}

export interface CalendarRace {
  season: number;
  round: number;
  name: string;
  circuitId: string;
  circuitName: string;
  country: string;
  city: string;
  date: string;
  time: string | null;
  hasResults: boolean;
}
