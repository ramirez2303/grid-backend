import { prisma } from "../config/database.js";
import { fetchCarData, fetchLocation, fetchLaps } from "./openF1Client.js";

import type { TelemetryComparisonResponse, TelemetryPoint, TelemetryDriverData } from "../types/telemetry.js";

interface DriverInfo { number: number; abbreviation: string; teamColor: string }

async function getDriverInfo(driverNumber: number): Promise<DriverInfo | null> {
  const driver = await prisma.driver.findFirst({
    where: { number: driverNumber },
    include: { team: { select: { colorPrimary: true } } },
  });
  if (!driver) return null;
  return { number: driver.number, abbreviation: driver.abbreviation, teamColor: driver.team.colorPrimary };
}

function getLapTimeRange(laps: { driver_number: number; lap_number: number; date_start: string | null }[], driverNum: number, lap: number): { start: number; end: number } | null {
  const sorted = laps.filter((l) => l.driver_number === driverNum && l.date_start).sort((a, b) => a.lap_number - b.lap_number);
  const lapData = sorted.find((l) => l.lap_number === lap);
  const nextLap = sorted.find((l) => l.lap_number === lap + 1);
  if (!lapData?.date_start) return null;
  const start = new Date(lapData.date_start).getTime();
  const end = nextLap?.date_start ? new Date(nextLap.date_start).getTime() : start + 100000;
  return { start, end };
}

async function buildDriverTelemetry(sessionKey: number, driverNumber: number, lap: number, laps: typeof fetchLaps extends (...a: never[]) => Promise<infer R> ? Awaited<R> : never): Promise<TelemetryPoint[]> {
  const range = getLapTimeRange(laps, driverNumber, lap);
  if (!range) return [];

  const [carData, locData] = await Promise.all([fetchCarData(sessionKey, driverNumber), fetchLocation(sessionKey, driverNumber)]);

  const lapCar = carData.filter((c) => { const t = new Date(c.date).getTime(); return t >= range.start && t < range.end; });
  const lapLoc = locData.filter((l) => { const t = new Date(l.date).getTime(); return t >= range.start && t < range.end && (l.x !== 0 || l.y !== 0); });

  if (lapLoc.length < 2) return [];

  // Build distance array from location
  const locDist: { time: number; dist: number }[] = [];
  let cumDist = 0;
  for (let i = 0; i < lapLoc.length; i++) {
    if (i > 0) {
      const dx = lapLoc[i]!.x - lapLoc[i - 1]!.x;
      const dy = lapLoc[i]!.y - lapLoc[i - 1]!.y;
      cumDist += Math.sqrt(dx * dx + dy * dy);
    }
    locDist.push({ time: new Date(lapLoc[i]!.date).getTime(), dist: cumDist });
  }

  // Interpolate distance for each car_data point by timestamp
  const points: TelemetryPoint[] = [];
  for (const cd of lapCar) {
    const t = new Date(cd.date).getTime();
    let dist = 0;
    for (let i = 0; i < locDist.length - 1; i++) {
      if (t >= locDist[i]!.time && t <= locDist[i + 1]!.time) {
        const frac = (t - locDist[i]!.time) / (locDist[i + 1]!.time - locDist[i]!.time);
        dist = locDist[i]!.dist + frac * (locDist[i + 1]!.dist - locDist[i]!.dist);
        break;
      }
      if (t > locDist[locDist.length - 1]!.time) dist = locDist[locDist.length - 1]!.dist;
    }
    points.push({ distance: Math.round(dist), speed: cd.speed, throttle: cd.throttle, brake: cd.brake, gear: cd.n_gear });
  }

  return points;
}

export async function getTelemetryComparison(sessionKey: number, d1Num: number, d2Num: number, lap: number): Promise<TelemetryComparisonResponse | null> {
  const [info1, info2] = await Promise.all([getDriverInfo(d1Num), getDriverInfo(d2Num)]);
  if (!info1 || !info2) return null;

  const laps = await fetchLaps(sessionKey);
  const [pts1, pts2] = await Promise.all([
    buildDriverTelemetry(sessionKey, d1Num, lap, laps),
    buildDriverTelemetry(sessionKey, d2Num, lap, laps),
  ]);

  if (pts1.length === 0 && pts2.length === 0) return null;

  const totalDist = Math.max(pts1[pts1.length - 1]?.distance ?? 0, pts2[pts2.length - 1]?.distance ?? 0);

  return {
    driver1: { driverNumber: d1Num, abbreviation: info1.abbreviation, teamColor: info1.teamColor, points: pts1 },
    driver2: { driverNumber: d2Num, abbreviation: info2.abbreviation, teamColor: info2.teamColor, points: pts2 },
    lap, totalDistance: totalDist, corners: [],
  };
}
