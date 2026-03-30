export interface CircuitResponse {
  id: string;
  name: string;
  country: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  length: number | null;
  turns: number | null;
  drsZones: number | null;
  type: string | null;
  lapRecordTime: string | null;
  lapRecordDriver: string | null;
  lapRecordYear: number | null;
  numberOfLaps: number | null;
  raceDistance: string | null;
  firstGrandPrix: number | null;
  totalEditions: number | null;
  description: string | null;
}

export interface CircuitListItem {
  id: string;
  name: string;
  country: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  length: number | null;
  turns: number | null;
  type: string | null;
}
