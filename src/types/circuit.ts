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
