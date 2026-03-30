import { prisma } from "../config/database.js";
import { CURRENT_SEASON } from "../config/apis.js";

import type { DriverStandingItem, ConstructorStandingItem } from "../types/standings.js";

export async function getDriverStandings(): Promise<DriverStandingItem[]> {
  const allResults = await prisma.result.findMany({
    where: { race: { season: CURRENT_SEASON } },
    include: {
      driver: {
        include: { team: { select: { id: true, name: true, colorPrimary: true } } },
      },
    },
  });

  const driverStats = new Map<string, {
    points: number; wins: number; podiums: number;
    poles: number; fastestLaps: number; dnfs: number;
    driver: typeof allResults[0]["driver"];
  }>();

  for (const r of allResults) {
    const existing = driverStats.get(r.driverId) ?? {
      points: 0, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, dnfs: 0,
      driver: r.driver,
    };
    existing.points += r.points;
    if (r.position === 1) existing.wins++;
    if (r.position != null && r.position <= 3) existing.podiums++;
    if (r.gridPosition === 1) existing.poles++;
    if (r.fastestLap) existing.fastestLaps++;
    if (r.position == null || (r.status != null && r.status !== "Finished")) existing.dnfs++;
    driverStats.set(r.driverId, existing);
  }

  return [...driverStats.entries()]
    .map(([driverId, s]) => ({
      position: 0,
      driverId,
      firstName: s.driver.firstName,
      lastName: s.driver.lastName,
      abbreviation: s.driver.abbreviation,
      number: s.driver.number,
      nationality: s.driver.nationality,
      points: s.points,
      wins: s.wins,
      podiums: s.podiums,
      poles: s.poles,
      fastestLaps: s.fastestLaps,
      dnfs: s.dnfs,
      teamId: s.driver.team.id,
      teamName: s.driver.team.name,
      teamColor: s.driver.team.colorPrimary,
    }))
    .sort((a, b) => b.points - a.points)
    .map((item, i) => ({ ...item, position: i + 1 }));
}

export async function getConstructorStandings(): Promise<ConstructorStandingItem[]> {
  const allResults = await prisma.result.findMany({
    where: { race: { season: CURRENT_SEASON } },
    include: { team: true },
  });

  const teamStats = new Map<string, {
    points: number; wins: number; podiums: number;
    team: typeof allResults[0]["team"];
  }>();

  for (const r of allResults) {
    const existing = teamStats.get(r.teamId) ?? {
      points: 0, wins: 0, podiums: 0, team: r.team,
    };
    existing.points += r.points;
    if (r.position === 1) existing.wins++;
    if (r.position != null && r.position <= 3) existing.podiums++;
    teamStats.set(r.teamId, existing);
  }

  return [...teamStats.entries()]
    .map(([teamId, s]) => ({
      position: 0,
      teamId,
      name: s.team.name,
      fullName: s.team.fullName,
      color: s.team.colorPrimary,
      points: s.points,
      wins: s.wins,
      podiums: s.podiums,
      engine: s.team.engine,
    }))
    .sort((a, b) => b.points - a.points)
    .map((item, i) => ({ ...item, position: i + 1 }));
}
