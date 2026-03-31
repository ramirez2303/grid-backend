import axios from "axios";
import { OPENF1_BASE_URL } from "../config/apis.js";
import { getCachedData, setCachedData } from "./timingCacheService.js";

const api = axios.create({ baseURL: OPENF1_BASE_URL, timeout: 20000 });

export interface OF1Lap {
  driver_number: number; lap_number: number; lap_duration: number | null;
  duration_sector_1: number | null; duration_sector_2: number | null; duration_sector_3: number | null;
  segments_sector_1: number[]; segments_sector_2: number[]; segments_sector_3: number[];
  st_speed: number | null; is_pit_out_lap: boolean;
}
export interface OF1Position { driver_number: number; position: number; date: string }
export interface OF1Interval { driver_number: number; gap_to_leader: number | null; interval: number | null; date: string }
export interface OF1Pit { driver_number: number; lap_number: number; pit_duration: number | null; date: string }
export interface OF1Stint { driver_number: number; stint_number: number; compound: string; lap_start: number; lap_end: number; tyre_age_at_start: number }
export interface OF1RaceControl { date: string; lap_number: number | null; category: string; flag: string | null; message: string; sector: number | null }
export interface OF1Weather { air_temperature: number; track_temperature: number; humidity: number; wind_speed: number; wind_direction: number; rainfall: number; pressure: number }
export interface OF1Meeting { meeting_key: number; meeting_name: string; location: string; country_name: string; date_start: string }
export interface OF1Session { session_key: number; meeting_key: number; session_name: string; session_type: string; date_start: string; date_end: string }

async function fetchRaw<T>(path: string, params?: Record<string, unknown>): Promise<T[]> {
  try {
    const { data, status } = await api.get<T[] | { detail: string }>(path, { params });
    const count = Array.isArray(data) ? data.length : 0;
    console.log(`[OpenF1] GET ${path} → ${status} (${count} records)`);
    if (!Array.isArray(data)) return [];
    return data;
  } catch (err) {
    const status = axios.isAxiosError(err) ? err.response?.status : "timeout";
    console.error(`[OpenF1] GET ${path} → FAILED (${status})`);
    return [];
  }
}

async function cachedGet<T>(sessionKey: number, endpoint: string, path: string, params?: Record<string, unknown>): Promise<T[]> {
  const cached = await getCachedData<T>(sessionKey, endpoint);
  if (cached) {
    console.log(`[Cache HIT] ${endpoint} session=${sessionKey} (${cached.length} records)`);
    return cached;
  }
  const data = await fetchRaw<T>(path, params);
  if (data.length > 0) {
    await setCachedData(sessionKey, endpoint, data).catch(() => null);
  }
  return data;
}

export const fetchMeetings = (year: number) => fetchRaw<OF1Meeting>("/meetings", { year });
export const fetchSessions = (meetingKey: number) => fetchRaw<OF1Session>("/sessions", { meeting_key: meetingKey });
export const fetchSessionByKey = (sessionKey: number) => fetchRaw<OF1Session>("/sessions", { session_key: sessionKey });
export const fetchLaps = (sk: number) => cachedGet<OF1Lap>(sk, "laps", "/laps", { session_key: sk });
export const fetchPositions = (sk: number) => cachedGet<OF1Position>(sk, "positions", "/position", { session_key: sk });
export const fetchIntervals = (sk: number) => cachedGet<OF1Interval>(sk, "intervals", "/intervals", { session_key: sk });
export const fetchPitStops = (sk: number) => cachedGet<OF1Pit>(sk, "pit", "/pit", { session_key: sk });
export const fetchStints = (sk: number) => cachedGet<OF1Stint>(sk, "stints", "/stints", { session_key: sk });
export const fetchRaceControl = (sk: number) => cachedGet<OF1RaceControl>(sk, "race_control", "/race_control", { session_key: sk });
export const fetchWeather = (sk: number) => cachedGet<OF1Weather>(sk, "weather", "/weather", { session_key: sk });

export interface OF1Location { x: number; y: number; z: number; driver_number: number; date: string }
export const fetchLocation = (sk: number, driverNumber: number) => cachedGet<OF1Location>(sk, `location-${driverNumber}`, "/location", { session_key: sk, driver_number: driverNumber });
