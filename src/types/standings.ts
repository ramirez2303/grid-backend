export interface DriverStandingItem {
  position: number;
  driverId: string;
  firstName: string;
  lastName: string;
  abbreviation: string;
  number: number;
  nationality: string;
  points: number;
  wins: number;
  teamId: string;
  teamName: string;
  teamColor: string;
}

export interface ConstructorStandingItem {
  position: number;
  teamId: string;
  name: string;
  fullName: string;
  color: string;
  points: number;
  wins: number;
  engine: string;
}
