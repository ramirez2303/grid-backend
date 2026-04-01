export interface TelemetryPoint {
  distance: number;
  speed: number;
  throttle: number;
  brake: number;
  gear: number;
}

export interface TelemetryDriverData {
  driverNumber: number;
  abbreviation: string;
  teamColor: string;
  points: TelemetryPoint[];
}

export interface TelemetryComparisonResponse {
  driver1: TelemetryDriverData;
  driver2: TelemetryDriverData;
  lap: number;
  totalDistance: number;
  corners: { number: number; distance: number; name?: string }[];
}
