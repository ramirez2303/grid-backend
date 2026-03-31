import type { SectorColor, Compound, RaceControlMessage, WeatherData, StintData, MeetingInfo, SessionInfo } from "../types/timing.js";
import type { OF1RaceControl, OF1Weather, OF1Stint, OF1Meeting, OF1Session } from "./openF1Client.js";

export function mapSectorColor(segments: number[]): SectorColor {
  if (!segments || segments.length === 0) return "none";
  if (segments.includes(2050)) return "purple";
  if (segments.includes(2049)) return "green";
  if (segments.includes(2048)) return "yellow";
  return "none";
}

export function mapCompound(raw: string | undefined): Compound {
  if (!raw) return "UNKNOWN";
  const upper = raw.toUpperCase();
  if (upper === "SOFT" || upper === "MEDIUM" || upper === "HARD" || upper === "INTERMEDIATE" || upper === "WET") {
    return upper as Compound;
  }
  return "UNKNOWN";
}

export function formatLapTime(seconds: number | null): string | null {
  if (seconds == null) return null;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0
    ? `${mins}:${secs.toFixed(3).padStart(6, "0")}`
    : secs.toFixed(3);
}

export function transformRaceControl(raw: OF1RaceControl[]): RaceControlMessage[] {
  return raw.map((r) => ({
    date: r.date,
    lap: r.lap_number,
    category: r.category,
    flag: r.flag,
    message: r.message,
    sector: r.sector,
  }));
}

export function transformWeather(raw: OF1Weather[]): WeatherData | null {
  const last = raw[raw.length - 1];
  if (!last) return null;
  return {
    airTemperature: last.air_temperature,
    trackTemperature: last.track_temperature,
    humidity: last.humidity,
    windSpeed: last.wind_speed,
    windDirection: last.wind_direction,
    rainfall: last.rainfall,
    pressure: last.pressure,
  };
}

export function transformStints(raw: OF1Stint[]): StintData[] {
  return raw.map((s) => ({
    driverNumber: s.driver_number,
    driverId: "",
    stintNumber: s.stint_number,
    compound: mapCompound(s.compound),
    lapStart: s.lap_start,
    lapEnd: s.lap_end,
    tyreAge: s.tyre_age_at_start,
  }));
}

export function transformMeetings(raw: OF1Meeting[]): MeetingInfo[] {
  return raw.map((m) => ({
    meetingKey: m.meeting_key,
    name: m.meeting_name,
    location: m.location,
    country: m.country_name,
    dateStart: m.date_start,
  }));
}

export function transformSessions(raw: OF1Session[]): SessionInfo[] {
  return raw.map((s) => ({
    sessionKey: s.session_key,
    meetingKey: s.meeting_key,
    name: s.session_name,
    type: s.session_type,
    dateStart: s.date_start,
    dateEnd: s.date_end,
  }));
}
