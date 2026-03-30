import { prisma } from "../config/database.js";
import { CURRENT_SEASON } from "../config/apis.js";

import type { RaceWithResults, RaceResultItem } from "../types/result.js";

function mapResults(results: Array<{
  position: number | null;
  gridPosition: number | null;
  points: number;
  status: string | null;
  time: string | null;
  fastestLap: boolean;
  fastestLapTime: string | null;
  driver: { id: string; firstName: string; lastName: string; abbreviation: string; number: number };
  team: { id: string; name: string; colorPrimary: string };
}>): RaceResultItem[] {
  return results
    .sort((a, b) => (a.position ?? 99) - (b.position ?? 99))
    .map((r) => ({
      position: r.position,
      driverId: r.driver.id,
      firstName: r.driver.firstName,
      lastName: r.driver.lastName,
      abbreviation: r.driver.abbreviation,
      driverNumber: r.driver.number,
      teamId: r.team.id,
      teamName: r.team.name,
      teamColor: r.team.colorPrimary,
      gridPosition: r.gridPosition,
      points: r.points,
      status: r.status,
      time: r.time,
      fastestLap: r.fastestLap,
      fastestLapTime: r.fastestLapTime,
    }));
}

export async function getResultsByRound(round: number): Promise<RaceWithResults | null> {
  const race = await prisma.race.findUnique({
    where: { season_round: { season: CURRENT_SEASON, round } },
    include: {
      circuit: true,
      results: {
        include: {
          driver: { select: { id: true, firstName: true, lastName: true, abbreviation: true, number: true } },
          team: { select: { id: true, name: true, colorPrimary: true } },
        },
      },
    },
  });

  if (!race || race.results.length === 0) return null;

  return {
    season: race.season,
    round: race.round,
    name: race.name,
    circuitName: race.circuit.name,
    country: race.circuit.country,
    date: race.date.toISOString(),
    results: mapResults(race.results),
  };
}

export async function getLastRaceResults(): Promise<RaceWithResults | null> {
  const lastRace = await prisma.race.findFirst({
    where: {
      season: CURRENT_SEASON,
      results: { some: {} },
    },
    orderBy: { round: "desc" },
  });

  if (!lastRace) return null;
  return getResultsByRound(lastRace.round);
}
