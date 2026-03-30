import { prisma } from "../config/database.js";
import { CURRENT_SEASON } from "../config/apis.js";

import type { DriverStandingItem, ConstructorStandingItem } from "../types/standings.js";

export async function getDriverStandings(): Promise<DriverStandingItem[]> {
  const results = await prisma.result.groupBy({
    by: ["driverId"],
    where: { race: { season: CURRENT_SEASON } },
    _sum: { points: true },
  });

  const driverIds = results.map((r) => r.driverId);
  const drivers = await prisma.driver.findMany({
    where: { id: { in: driverIds } },
    include: { team: { select: { id: true, name: true, colorPrimary: true } } },
  });

  const driverMap = new Map(drivers.map((d) => [d.id, d]));

  const winCounts = await prisma.result.groupBy({
    by: ["driverId"],
    where: { race: { season: CURRENT_SEASON }, position: 1 },
    _count: true,
  });
  const winsMap = new Map(winCounts.map((w) => [w.driverId, w._count]));

  return results
    .map((r, index) => {
      const driver = driverMap.get(r.driverId);
      if (!driver) return null;
      return {
        position: index + 1,
        driverId: driver.id,
        firstName: driver.firstName,
        lastName: driver.lastName,
        abbreviation: driver.abbreviation,
        number: driver.number,
        nationality: driver.nationality,
        points: r._sum.points ?? 0,
        wins: winsMap.get(r.driverId) ?? 0,
        teamId: driver.team.id,
        teamName: driver.team.name,
        teamColor: driver.team.colorPrimary,
      };
    })
    .filter((item): item is DriverStandingItem => item !== null)
    .sort((a, b) => b.points - a.points)
    .map((item, index) => ({ ...item, position: index + 1 }));
}

export async function getConstructorStandings(): Promise<ConstructorStandingItem[]> {
  const results = await prisma.result.groupBy({
    by: ["teamId"],
    where: { race: { season: CURRENT_SEASON } },
    _sum: { points: true },
  });

  const teamIds = results.map((r) => r.teamId);
  const teams = await prisma.team.findMany({
    where: { id: { in: teamIds } },
  });
  const teamMap = new Map(teams.map((t) => [t.id, t]));

  const winCounts = await prisma.result.groupBy({
    by: ["teamId"],
    where: { race: { season: CURRENT_SEASON }, position: 1 },
    _count: true,
  });
  const winsMap = new Map(winCounts.map((w) => [w.teamId, w._count]));

  return results
    .map((r, index) => {
      const team = teamMap.get(r.teamId);
      if (!team) return null;
      return {
        position: index + 1,
        teamId: team.id,
        name: team.name,
        fullName: team.fullName,
        color: team.colorPrimary,
        points: r._sum.points ?? 0,
        wins: winsMap.get(r.teamId) ?? 0,
        engine: team.engine,
      };
    })
    .filter((item): item is ConstructorStandingItem => item !== null)
    .sort((a, b) => b.points - a.points)
    .map((item, index) => ({ ...item, position: index + 1 }));
}
