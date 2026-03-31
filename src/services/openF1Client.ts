import axios from "axios";
import { OPENF1_BASE_URL } from "../config/apis.js";

const api = axios.create({ baseURL: OPENF1_BASE_URL, timeout: 15000 });

export interface OF1Lap {
  driver_number: number;
  lap_number: number;
  lap_duration: number | null;
  duration_sector_1: number | null;
  duration_sector_2: number | null;
  duration_sector_3: number | null;
  segments_sector_1: number[];
  segments_sector_2: number[];
  segments_sector_3: number[];
  st_speed: number | null;
  is_pit_out_lap: boolean;
}

export interface OF1Position { driver_number: number; position: number; date: string }
export interface OF1Interval { driver_number: number; gap_to_leader: number | null; interval: number | null; date: string }
export interface OF1Pit { driver_number: number; lap_number: number; pit_duration: number | null; date: string }
export interface OF1Stint { driver_number: number; stint_number: number; compound: string; lap_start: number; lap_end: number; tyre_age_at_start: number }
export interface OF1RaceControl { date: string; lap_number: number | null; category: string; flag: string | null; message: string; sector: number | null }
export interface OF1Weather { air_temperature: number; track_temperature: number; humidity: number; wind_speed: number; wind_direction: number; rainfall: number; pressure: number }
export interface OF1Meeting { meeting_key: number; meeting_name: string; location: string; country_name: string; date_start: string }
export interface OF1Session { session_key: number; meeting_key: number; session_name: string; session_type: string; date_start: string; date_end: string }

async function get<T>(path: string, params?: Record<string, unknown>): Promise<T[]> {
  try {
    const { data } = await api.get<T[] | { detail: string }>(path, { params });
    if (!Array.isArray(data)) return [];
    return data;
  } catch { return []; }
}

export const fetchMeetings = (year: number) => get<OF1Meeting>("/meetings", { year });
export const fetchSessions = (meetingKey: number) => get<OF1Session>("/sessions", { meeting_key: meetingKey });
export const fetchSessionByKey = (sessionKey: number) => get<OF1Session>("/sessions", { session_key: sessionKey });
export const fetchLaps = (sessionKey: number, driverNumber?: number) => get<OF1Lap>("/laps", { session_key: sessionKey, ...(driverNumber ? { driver_number: driverNumber } : {}) });
export const fetchPositions = (sessionKey: number) => get<OF1Position>("/position", { session_key: sessionKey });
export const fetchIntervals = (sessionKey: number) => get<OF1Interval>("/intervals", { session_key: sessionKey });
export const fetchPitStops = (sessionKey: number) => get<OF1Pit>("/pit", { session_key: sessionKey });
export const fetchStints = (sessionKey: number) => get<OF1Stint>("/stints", { session_key: sessionKey });
export const fetchRaceControl = (sessionKey: number) => get<OF1RaceControl>("/race_control", { session_key: sessionKey });
export const fetchWeather = (sessionKey: number) => get<OF1Weather>("/weather", { session_key: sessionKey });
