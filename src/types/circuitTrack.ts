export interface CircuitCorner {
  number: number;
  angle: number;
  length: number;
  x: number;
  y: number;
}

export interface CircuitMarshalSector {
  number: number;
  x: number;
  y: number;
}

export interface CircuitTrackDataResponse {
  trackPoints: { x: number; y: number }[];
  corners: CircuitCorner[];
  marshalSectors: CircuitMarshalSector[];
  rotation: number;
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
}

export interface CircuitElevationResponse {
  points: { distance: number; altitude: number }[];
  minAltitude: number;
  maxAltitude: number;
  totalClimb: number;
}
