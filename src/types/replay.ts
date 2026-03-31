export interface TrackPoint {
  x: number;
  y: number;
}

export interface ElevationPoint {
  distance: number;
  altitude: number;
}

export interface ReplayFrame {
  driverNumber: number;
  x: number;
  y: number;
}

export interface ReplayDriverInfo {
  driverNumber: number;
  abbreviation: string;
  teamColor: string;
}

export interface TrackOutlineResponse {
  points: TrackPoint[];
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
}

export interface ReplayDataResponse {
  timestamps: number[];
  frames: Record<number, ReplayFrame[]>;
  totalLaps: number;
  drivers: ReplayDriverInfo[];
}

export interface ElevationProfileResponse {
  points: ElevationPoint[];
}
