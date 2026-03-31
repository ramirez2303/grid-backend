import { prisma } from "../config/database.js";
import { fetchLaps, fetchPositions, fetchIntervals, fetchPitStops, fetchStints, fetchSessions } from "./openF1Client.js";
import { mapSectorColor, mapCompound, formatLapTime, transformStints } from "./openF1Transform.js";

import type { TimingEntry, TimingResponse, PitStopEntry, StintData } from "../types/timing.js";

interface DriverInfo { number: number; id: string; abbreviation: string; teamId: string; teamColor: string }

async function getDriverMap(): Promise<Map<number, DriverInfo>> {
  const drivers = await prisma.driver.findMany({ include: { team: { select: { id: true, colorPrimary: true } } } });
  const map = new Map<number, DriverInfo>();
  for (const d of drivers) {
    map.set(d.number, { number: d.number, id: d.id, abbreviation: d.abbreviation, teamId: d.team.id, teamColor: d.team.colorPrimary });
  }
  return map;
}

export async function getTimingBoard(sessionKey: number): Promise<TimingResponse> {
  const [laps, positions, intervals, stints, sessions] = await Promise.all([
    fetchLaps(sessionKey), fetchPositions(sessionKey), fetchIntervals(sessionKey), fetchStints(sessionKey), fetchSessions(0),
  ]);
  const driverMap = await getDriverMap();
  const session = sessions.find((s) => s.session_key === sessionKey);

  const latestPos = new Map<number, number>();
  for (const p of positions) latestPos.set(p.driver_number, p.position);

  const latestGap = new Map<number, { leader: number | null; interval: number | null }>();
  for (const i of intervals) latestGap.set(i.driver_number, { leader: i.gap_to_leader, interval: i.interval });

  const driverLaps = new Map<number, typeof laps>();
  for (const l of laps) { const arr = driverLaps.get(l.driver_number) ?? []; arr.push(l); driverLaps.set(l.driver_number, arr); }

  const driverStints = new Map<number, typeof stints>();
  for (const s of stints) { const arr = driverStints.get(s.driver_number) ?? []; arr.push(s); driverStints.set(s.driver_number, arr); }

  const pitCounts = new Map<number, number>();
  const rawPits = await fetchPitStops(sessionKey);
  for (const p of rawPits) pitCounts.set(p.driver_number, (pitCounts.get(p.driver_number) ?? 0) + 1);

  const entries: TimingEntry[] = [];

  for (const [driverNum, pos] of latestPos) {
    const info = driverMap.get(driverNum);
    if (!info) continue;
    const dLaps = driverLaps.get(driverNum) ?? [];
    const lastLap = dLaps[dLaps.length - 1];
    const bestLap = dLaps.reduce<number | null>((best, l) => {
      if (l.lap_duration == null || l.is_pit_out_lap) return best;
      return best == null || l.lap_duration < best ? l.lap_duration : best;
    }, null);
    const gap = latestGap.get(driverNum);
    const dStints = driverStints.get(driverNum) ?? [];
    const currentStint = dStints[dStints.length - 1];

    entries.push({
      position: pos, driverNumber: driverNum, driverId: info.id, abbreviation: info.abbreviation,
      teamId: info.teamId, teamColor: info.teamColor,
      gapToLeader: gap?.leader != null ? (typeof gap.leader === "number" ? `+${gap.leader.toFixed(3)}` : String(gap.leader)) : null,
      gapToAhead: gap?.interval != null ? (typeof gap.interval === "number" ? `+${gap.interval.toFixed(3)}` : String(gap.interval)) : null,
      bestLapTime: formatLapTime(bestLap), lastLapTime: formatLapTime(lastLap?.lap_duration ?? null),
      sector1: { time: lastLap?.duration_sector_1 ?? null, color: mapSectorColor(lastLap?.segments_sector_1 ?? []) },
      sector2: { time: lastLap?.duration_sector_2 ?? null, color: mapSectorColor(lastLap?.segments_sector_2 ?? []) },
      sector3: { time: lastLap?.duration_sector_3 ?? null, color: mapSectorColor(lastLap?.segments_sector_3 ?? []) },
      compound: mapCompound(currentStint?.compound), tyreAge: currentStint ? (currentStint.lap_end - currentStint.lap_start + currentStint.tyre_age_at_start) : 0,
      pitStops: pitCounts.get(driverNum) ?? 0, topSpeed: lastLap?.st_speed ?? null,
      lapsCompleted: dLaps.length,
    });
  }

  entries.sort((a, b) => a.position - b.position);
  const totalLaps = Math.max(...entries.map((e) => e.lapsCompleted), 0);

  return {
    session: session ? { sessionKey: session.session_key, meetingKey: session.meeting_key, name: session.session_name, type: session.session_type, dateStart: session.date_start, dateEnd: session.date_end } : { sessionKey, meetingKey: 0, name: "Unknown", type: "Race", dateStart: "", dateEnd: "" },
    entries, totalLaps,
  };
}

export async function getPitStopSummary(sessionKey: number): Promise<PitStopEntry[]> {
  const [rawPits, rawStints] = await Promise.all([fetchPitStops(sessionKey), fetchStints(sessionKey)]);
  const driverMap = await getDriverMap();
  const stintsByDriver = new Map<number, typeof rawStints>();
  for (const s of rawStints) { const arr = stintsByDriver.get(s.driver_number) ?? []; arr.push(s); stintsByDriver.set(s.driver_number, arr); }

  return rawPits.map((p) => {
    const info = driverMap.get(p.driver_number);
    const dStints = stintsByDriver.get(p.driver_number) ?? [];
    const stintBefore = dStints.find((s) => s.lap_end === p.lap_number || s.lap_end === p.lap_number - 1);
    const stintAfter = dStints.find((s) => s.lap_start === p.lap_number || s.lap_start === p.lap_number + 1);
    return {
      driverNumber: p.driver_number, driverId: info?.id ?? "", abbreviation: info?.abbreviation ?? String(p.driver_number),
      teamColor: info?.teamColor ?? "#888", lap: p.lap_number, duration: p.pit_duration,
      compoundOld: mapCompound(stintBefore?.compound), compoundNew: mapCompound(stintAfter?.compound),
    };
  }).sort((a, b) => a.lap - b.lap);
}

export async function getStrategyOverview(sessionKey: number): Promise<StintData[]> {
  const rawStints = await fetchStints(sessionKey);
  const driverMap = await getDriverMap();
  const transformed = transformStints(rawStints);
  return transformed.map((s) => ({ ...s, driverId: driverMap.get(s.driverNumber)?.id ?? "" }));
}
