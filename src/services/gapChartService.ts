import { prisma } from "../config/database.js";
import { fetchLaps, fetchPitStops, fetchRaceControl } from "./openF1Client.js";
import { getCachedData, setCachedData } from "./timingCacheService.js";

import type { GapChartResponse, DriverGapSeries, PitStopMarker } from "../types/gapChart.js";

interface DriverInfo { number: number; abbreviation: string; teamColor: string }

async function getDriverMap(): Promise<Map<number, DriverInfo>> {
  const drivers = await prisma.driver.findMany({ include: { team: { select: { colorPrimary: true } } } });
  const map = new Map<number, DriverInfo>();
  for (const d of drivers) map.set(d.number, { number: d.number, abbreviation: d.abbreviation, teamColor: d.team.colorPrimary });
  return map;
}

export async function getGapChartData(sessionKey: number): Promise<GapChartResponse> {
  const cached = await getCachedData<GapChartResponse>(sessionKey, "gaps");
  if (cached && cached.length > 0) return cached[0]!;

  const [laps, pits, rc] = await Promise.all([
    fetchLaps(sessionKey), fetchPitStops(sessionKey), fetchRaceControl(sessionKey),
  ]);
  const driverMap = await getDriverMap();

  // Group laps by driver and compute cumulative time
  const cumulative = new Map<number, Map<number, number>>();
  const driverLaps = new Map<number, typeof laps>();
  for (const l of laps) {
    const arr = driverLaps.get(l.driver_number) ?? [];
    arr.push(l);
    driverLaps.set(l.driver_number, arr);
  }

  let maxLap = 0;
  for (const [driverNum, dLaps] of driverLaps) {
    const sorted = dLaps.sort((a, b) => a.lap_number - b.lap_number);
    let cum = 0;
    const lapMap = new Map<number, number>();
    for (const l of sorted) {
      if (l.lap_duration == null) continue;
      cum += l.lap_duration;
      lapMap.set(l.lap_number, cum);
      if (l.lap_number > maxLap) maxLap = l.lap_number;
    }
    cumulative.set(driverNum, lapMap);
  }

  // Find leader time per lap
  const leaderTime = new Map<number, number>();
  for (let lap = 1; lap <= maxLap; lap++) {
    let minTime = Infinity;
    for (const [, lapMap] of cumulative) {
      const t = lapMap.get(lap);
      if (t != null && t < minTime) minTime = t;
    }
    if (minTime < Infinity) leaderTime.set(lap, minTime);
  }

  // Build gap series per driver
  const drivers: DriverGapSeries[] = [];
  for (const [driverNum, lapMap] of cumulative) {
    const info = driverMap.get(driverNum);
    if (!info) continue;
    const gaps = [];
    for (let lap = 1; lap <= maxLap; lap++) {
      const t = lapMap.get(lap);
      const lt = leaderTime.get(lap);
      if (t == null || lt == null) continue;
      gaps.push({ lap, gap: Math.round((t - lt) * 1000) / 1000 });
    }
    drivers.push({ driverNumber: driverNum, abbreviation: info.abbreviation, teamColor: info.teamColor, gaps });
  }

  // Safety car laps
  const scLaps = rc
    .filter((m) => m.category === "SafetyCar" || (m.message && m.message.toUpperCase().includes("SAFETY CAR")))
    .map((m) => m.lap_number)
    .filter((l): l is number => l != null);
  const safetyCarLaps = [...new Set(scLaps)].sort((a, b) => a - b);

  // Pit stop markers
  const pitStopLaps: PitStopMarker[] = pits.map((p) => ({ driverNumber: p.driver_number, lap: p.lap_number }));

  const result: GapChartResponse = { drivers, totalLaps: maxLap, safetyCarLaps, pitStopLaps };
  await setCachedData(sessionKey, "gaps", [result]).catch(() => null);
  return result;
}
