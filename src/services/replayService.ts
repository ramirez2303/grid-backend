import { prisma } from "../config/database.js";
import { fetchLocation, fetchLaps, fetchPositions } from "./openF1Client.js";

import type { OF1Location } from "./openF1Client.js";
import type { TrackOutlineResponse, ReplayDataResponse, ElevationProfileResponse, ReplayFrame, ReplayDriverInfo } from "../types/replay.js";

interface DriverInfo { number: number; abbreviation: string; teamColor: string }

async function getDriverMap(): Promise<Map<number, DriverInfo>> {
  const drivers = await prisma.driver.findMany({ include: { team: { select: { colorPrimary: true } } } });
  const map = new Map<number, DriverInfo>();
  for (const d of drivers) map.set(d.number, { number: d.number, abbreviation: d.abbreviation, teamColor: d.team.colorPrimary });
  return map;
}

function filterRaceData(records: OF1Location[]): OF1Location[] {
  return records.filter((r) => r.x !== 0 || r.y !== 0);
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

  const raw = await fetchLocation(sessionKey, driverNum);
  const raceData = filterRaceData(raw);

  const lapPoints = raceData.slice(0, 450);

  const points = lapPoints.map((r) => ({ x: r.x, y: r.y }));
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);

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

  console.log(`[Replay] Fetching location for ${driverNumbers.length} drivers...`);
  const locationResults = await Promise.allSettled(
    driverNumbers.map((num) => fetchLocation(sessionKey, num)),
  );

  const allFrames = new Map<number, ReplayFrame[]>();

  for (let i = 0; i < driverNumbers.length; i++) {
    const result = locationResults[i];
    if (!result || result.status !== "fulfilled") continue;
    const driverNum = driverNumbers[i]!;
    const raceData = filterRaceData(result.value);
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
    .map((num) => {
      const info = driverMap.get(num);
      return info ? { driverNumber: num, abbreviation: info.abbreviation, teamColor: info.teamColor } : null;
    })
    .filter((d): d is ReplayDriverInfo => d !== null);

  console.log(`[Replay] Data ready: ${timestamps.length} timestamps, ${drivers.length} drivers, ${totalLaps} laps`);
  return { timestamps, frames, totalLaps, drivers };
}

export async function getElevationProfile(sessionKey: number): Promise<ElevationProfileResponse> {
  const positions = await fetchPositions(sessionKey);
  const leader = positions.find((p) => p.position === 1);
  const driverNum = leader?.driver_number ?? 12;

  const raw = await fetchLocation(sessionKey, driverNum);
  const raceData = filterRaceData(raw);
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
