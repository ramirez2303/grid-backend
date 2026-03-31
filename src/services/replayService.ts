import { prisma } from "../config/database.js";
import { fetchLocation, fetchLaps, fetchPositions, fetchSessionByKey } from "./openF1Client.js";

import type { OF1Location } from "./openF1Client.js";
import type { TrackOutlineResponse, ReplayDataResponse, ElevationProfileResponse, ReplayFrame, ReplayDriverInfo } from "../types/replay.js";

interface DriverInfo { number: number; abbreviation: string; teamColor: string }

async function getDriverMap(): Promise<Map<number, DriverInfo>> {
  const drivers = await prisma.driver.findMany({ include: { team: { select: { colorPrimary: true } } } });
  const map = new Map<number, DriverInfo>();
  for (const d of drivers) map.set(d.number, { number: d.number, abbreviation: d.abbreviation, teamColor: d.team.colorPrimary });
  return map;
}

async function getSessionStartTime(sessionKey: number): Promise<number> {
  const sessions = await fetchSessionByKey(sessionKey);
  return sessions[0] ? new Date(sessions[0].date_start).getTime() : 0;
}

function filterRaceOnly(records: OF1Location[], sessionStart: number): OF1Location[] {
  return records.filter((r) => (r.x !== 0 || r.y !== 0) && new Date(r.date).getTime() >= sessionStart);
}

function filterByTimeRange(records: OF1Location[], startMs: number, endMs: number): OF1Location[] {
  return records.filter((r) => { const t = new Date(r.date).getTime(); return t >= startMs && t < endMs; });
}

function downsample(records: OF1Location[]): Map<number, OF1Location> {
  const bySecond = new Map<number, OF1Location>();
  for (const r of records) bySecond.set(Math.floor(new Date(r.date).getTime() / 1000) * 1000, r);
  return bySecond;
}

export async function getTrackOutline(sessionKey: number): Promise<TrackOutlineResponse> {
  const positions = await fetchPositions(sessionKey);
  const leader = positions.find((p) => p.position === 1);
  const driverNum = leader?.driver_number ?? 12;

  const allLaps = await fetchLaps(sessionKey);
  const driverLaps = allLaps.filter((l) => l.driver_number === driverNum).sort((a, b) => a.lap_number - b.lap_number);
  const lap1 = driverLaps.find((l) => l.lap_number === 2); // lap 2 start = lap 1 end
  const lap1Start = driverLaps.find((l) => l.lap_number === 1);

  const raw = await fetchLocation(sessionKey, driverNum);

  let lapPoints: OF1Location[];
  if (lap1Start?.date_start && lap1?.date_start) {
    const startMs = new Date(lap1Start.date_start).getTime();
    const endMs = new Date(lap1.date_start).getTime();
    lapPoints = filterByTimeRange(raw, startMs, endMs);
  } else {
    const sessionStart = await getSessionStartTime(sessionKey);
    lapPoints = filterRaceOnly(raw, sessionStart).slice(0, 450);
  }

  const points = lapPoints.map((r) => ({ x: r.x, y: r.y }));

  // Close the loop if needed
  if (points.length > 2) {
    const first = points[0]!;
    const last = points[points.length - 1]!;
    const dist = Math.sqrt((first.x - last.x) ** 2 + (first.y - last.y) ** 2);
    if (dist > 100) points.push({ x: first.x, y: first.y });
  }

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  console.log(`[Replay] Track: ${points.length} pts, X: ${Math.min(...xs)}..${Math.max(...xs)}, Y: ${Math.min(...ys)}..${Math.max(...ys)}`);

  return { points, bounds: { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) } };
}

export async function getReplayData(sessionKey: number): Promise<ReplayDataResponse> {
  const driverMap = await getDriverMap();
  const driverNumbers = [...driverMap.keys()];
  const laps = await fetchLaps(sessionKey);
  const totalLaps = Math.max(...laps.map((l) => l.lap_number), 0);
  const sessionStart = await getSessionStartTime(sessionKey);

  // Lap timestamps from the leader
  const positions = await fetchPositions(sessionKey);
  const leaderNum = positions.find((p) => p.position === 1)?.driver_number ?? 12;
  const leaderLaps = laps.filter((l) => l.driver_number === leaderNum).sort((a, b) => a.lap_number - b.lap_number);
  const lapTimestamps = leaderLaps.map((l) => l.date_start).filter(Boolean) as string[];

  const locationResults = await Promise.allSettled(driverNumbers.map((num) => fetchLocation(sessionKey, num)));
  const allFrames = new Map<number, ReplayFrame[]>();

  for (let i = 0; i < driverNumbers.length; i++) {
    const result = locationResults[i];
    if (!result || result.status !== "fulfilled") continue;
    const driverNum = driverNumbers[i]!;
    const raceData = filterRaceOnly(result.value, sessionStart);
    for (const [ts, loc] of downsample(raceData)) {
      const arr = allFrames.get(ts) ?? [];
      arr.push({ driverNumber: driverNum, x: loc.x, y: loc.y });
      allFrames.set(ts, arr);
    }
  }

  const timestamps = [...allFrames.keys()].sort((a, b) => a - b);
  const frames: Record<number, ReplayFrame[]> = {};
  for (const ts of timestamps) frames[ts] = allFrames.get(ts)!;

  const drivers: ReplayDriverInfo[] = driverNumbers
    .map((num) => { const info = driverMap.get(num); return info ? { driverNumber: num, abbreviation: info.abbreviation, teamColor: info.teamColor } : null; })
    .filter((d): d is ReplayDriverInfo => d !== null);

  console.log(`[Replay] Data: ${timestamps.length} ts, ${drivers.length} drivers, ${totalLaps} laps, ${lapTimestamps.length} lap markers`);
  return { timestamps, frames, totalLaps, drivers, lapTimestamps };
}

export async function getElevationProfile(sessionKey: number): Promise<ElevationProfileResponse> {
  const positions = await fetchPositions(sessionKey);
  const leader = positions.find((p) => p.position === 1);
  const driverNum = leader?.driver_number ?? 12;
  const allLaps = await fetchLaps(sessionKey);
  const driverLaps = allLaps.filter((l) => l.driver_number === driverNum).sort((a, b) => a.lap_number - b.lap_number);
  const lap1Start = driverLaps.find((l) => l.lap_number === 1);
  const lap2Start = driverLaps.find((l) => l.lap_number === 2);

  const raw = await fetchLocation(sessionKey, driverNum);
  let lapPoints: OF1Location[];
  if (lap1Start?.date_start && lap2Start?.date_start) {
    lapPoints = filterByTimeRange(raw, new Date(lap1Start.date_start).getTime(), new Date(lap2Start.date_start).getTime());
  } else {
    const sessionStart = await getSessionStartTime(sessionKey);
    lapPoints = filterRaceOnly(raw, sessionStart).slice(0, 450);
  }

  const points: { distance: number; altitude: number }[] = [];
  let cumDist = 0;
  for (let i = 0; i < lapPoints.length; i++) {
    if (i > 0) {
      const dx = lapPoints[i]!.x - lapPoints[i - 1]!.x;
      const dy = lapPoints[i]!.y - lapPoints[i - 1]!.y;
      cumDist += Math.sqrt(dx * dx + dy * dy);
    }
    points.push({ distance: Math.round(cumDist), altitude: lapPoints[i]!.z });
  }
  return { points };
}
