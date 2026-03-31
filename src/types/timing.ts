export type SectorColor = "purple" | "green" | "yellow" | "none";
export type Compound = "SOFT" | "MEDIUM" | "HARD" | "INTERMEDIATE" | "WET" | "UNKNOWN";

export interface TimingEntry {
  position: number;
  driverNumber: number;
  driverId: string;
  abbreviation: string;
  teamId: string;
  teamColor: string;
  gapToLeader: string | null;
  gapToAhead: string | null;
  bestLapTime: string | null;
  lastLapTime: string | null;
  sector1: { time: number | null; color: SectorColor };
  sector2: { time: number | null; color: SectorColor };
  sector3: { time: number | null; color: SectorColor };
  compound: Compound;
  tyreAge: number;
  pitStops: number;
  topSpeed: number | null;
  lapsCompleted: number;
}

export interface PitStopEntry {
  driverNumber: number;
  driverId: string;
  abbreviation: string;
  teamColor: string;
  lap: number;
  duration: number | null;
  compoundOld: Compound;
  compoundNew: Compound;
}

export interface RaceControlMessage {
  date: string;
  lap: number | null;
  category: string;
  flag: string | null;
  message: string;
  sector: number | null;
}

export interface WeatherData {
  airTemperature: number;
  trackTemperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  rainfall: number;
  pressure: number;
}

export interface StintData {
  driverNumber: number;
  driverId: string;
  stintNumber: number;
  compound: Compound;
  lapStart: number;
  lapEnd: number;
  tyreAge: number;
}

export interface MeetingInfo {
  meetingKey: number;
  name: string;
  location: string;
  country: string;
  dateStart: string;
}

export interface SessionInfo {
  sessionKey: number;
  meetingKey: number;
  name: string;
  type: string;
  dateStart: string;
  dateEnd: string;
}

export interface TimingResponse {
  session: SessionInfo;
  entries: TimingEntry[];
  totalLaps: number;
}
