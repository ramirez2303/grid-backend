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
  const session = sessions[0];
  if (!session) return 0;
  return new Date(session.date_start).getTime();
}

function filterRaceOnly(records: OF1Location[], sessionStart: number): OF1Location[] {
  const afterStart = records.filter((r) => {
    if (r.x === 0 && r.y === 0) return false;
    return new Date(r.date).getTime() >= sessionStart;
  });
  // Skip grid/formation — find first point where car has moved >1000m from initial position
  if (afterStart.length === 0) return [];
  const startX = afterStart[0]!.x;
  const startY = afterStart[0]!.y;
  const movingIdx = afterStart.findIndex((r) => {
    const dx = r.x - startX;
    const dy = r.y - startY;
    return Math.sqrt(dx * dx + dy * dy) > 1000;
  });
  return movingIdx > 0 ? afterStart.slice(movingIdx) : afterStart;
}

function downsample(records: OF1Location[]): Map<number, OF1Location> {
  const bySecond = new Map<number, OF1Location>();
  for (const r of records) {
    const ts = Math.floor(new Date(r.date).getTime() / 1000) * 1000;
    bySecond.set(ts, r);
  }
  return bySecond;
}

export async function getTrackOutline(sessionKey: number): Promise<TrackOutlineResponse> {
  const positions = await fetchPositions(sessionKey);
  const leader = positions.find((p) => p.position === 1);
  const driverNum = leader?.driver_number ?? 12;
  const sessionStart = await getSessionStartTime(sessionKey);

  const raw = await fetchLocation(sessionKey, driverNum);
  const raceData = filterRaceOnly(raw, sessionStart);

  // One lap at Suzuka ~90s, at 4.5Hz = ~405 points. Take 450 to be safe.
  const lapPoints = raceData.slice(0, 450);

  const points = lapPoints.map((r) => ({ x: r.x, y: r.y }));
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);

  console.log(`[Replay] Track outline: ${points.length} points, X: ${Math.min(...xs)}..${Math.max(...xs)}, Y: ${Math.min(...ys)}..${Math.max(...ys)}`);

  return {
    points,
    bounds: { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) },
  };
}

export async function getReplayData(sessionKey: number): Promise<ReplayDataResponse> {
  const driverMap = await getDriverMap();
  const driverNumbers = [...driverMap.keys()];
  const laps = await fetchLaps(sessionKey);
  const totalLaps = Math.max(...laps.map((l) => l.lap_number), 0);
  const sessionStart = await getSessionStartTime(sessionKey);

  console.log(`[Replay] Fetching location for ${driverNumbers.length} drivers...`);
  const locationResults = await Promise.allSettled(
    driverNumbers.map((num) => fetchLocation(sessionKey, num)),
  );

  const allFrames = new Map<number, ReplayFrame[]>();

  for (let i = 0; i < driverNumbers.length; i++) {
    const result = locationResults[i];
    if (!result || result.status !== "fulfilled") continue;
    const driverNum = driverNumbers[i]!;
    const raceData = filterRaceOnly(result.value, sessionStart);
    const sampled = downsample(raceData);

    for (const [ts, loc] of sampled) {
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

  console.log(`[Replay] Data ready: ${timestamps.length} timestamps, ${drivers.length} drivers, ${totalLaps} laps`);
  return { timestamps, frames, totalLaps, drivers };
}

export async function getElevationProfile(sessionKey: number): Promise<ElevationProfileResponse> {
  const positions = await fetchPositions(sessionKey);
  const leader = positions.find((p) => p.position === 1);
  const driverNum = leader?.driver_number ?? 12;
  const sessionStart = await getSessionStartTime(sessionKey);

  const raw = await fetchLocation(sessionKey, driverNum);
  const raceData = filterRaceOnly(raw, sessionStart);
  const lapPoints = raceData.slice(0, 450);

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
