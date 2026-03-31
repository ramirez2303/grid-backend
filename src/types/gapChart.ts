export interface GapDataPoint {
  lap: number;
  gap: number;
}

export interface DriverGapSeries {
  driverNumber: number;
  abbreviation: string;
  teamColor: string;
  gaps: GapDataPoint[];
}

export interface PitStopMarker {
  driverNumber: number;
  lap: number;
}

export interface GapChartResponse {
  drivers: DriverGapSeries[];
  totalLaps: number;
  safetyCarLaps: number[];
  pitStopLaps: PitStopMarker[];
}
