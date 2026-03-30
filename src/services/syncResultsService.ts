import axios from "axios";
import { prisma } from "../config/database.js";
import { JOLPICA_BASE_URL, CURRENT_SEASON } from "../config/apis.js";
import {
  jolpicaToGridDriverId,
  jolpicaToGridConstructorId,
} from "../config/circuitMapping.js";

import type { JolpicaRace, JolpicaResult } from "../types/jolpica.js";

interface JolpicaResultsResponse {
  MRData: {
    RaceTable: {
      Races: Array<JolpicaRace & { Results: JolpicaResult[] }>;
    };
  };
}

export async function syncResultsForRound(round: number): Promise<number> {
  const url = `${JOLPICA_BASE_URL}/${CURRENT_SEASON}/${round}/results.json`;
  const { data } = await axios.get<JolpicaResultsResponse>(url);
  const races = data.MRData.RaceTable.Races;

  if (races.length === 0 || !races[0]?.Results?.length) return 0;

  const race = races[0];
  const raceRecord = await prisma.race.findUnique({
    where: { season_round: { season: CURRENT_SEASON, round } },
  });
  if (!raceRecord) return 0;

  let synced = 0;
  for (const result of race.Results) {
    const driverId = jolpicaToGridDriverId[result.Driver.driverId];
    const teamId = jolpicaToGridConstructorId[result.Constructor.constructorId];
    if (!driverId || !teamId) continue;

    const position = result.positionText === "R" ? null : Number(result.position);
    const hasFastestLap = result.FastestLap?.rank === "1";

    await prisma.result.upsert({
      where: { raceId_driverId: { raceId: raceRecord.id, driverId } },
      update: {
        teamId,
        position,
        gridPosition: Number(result.grid),
        points: Number(result.points),
        status: result.status,
        time: result.Time?.time ?? null,
        fastestLap: hasFastestLap,
        fastestLapTime: result.FastestLap?.Time.time ?? null,
      },
      create: {
        raceId: raceRecord.id,
        driverId,
        teamId,
        position,
        gridPosition: Number(result.grid),
        points: Number(result.points),
        status: result.status,
        time: result.Time?.time ?? null,
        fastestLap: hasFastestLap,
        fastestLapTime: result.FastestLap?.Time.time ?? null,
      },
    });
    synced++;
  }

  console.log(`Round ${round} results synced: ${synced} entries`);
  return synced;
}

export async function syncAllResults(): Promise<number> {
  const races = await prisma.race.findMany({
    where: { season: CURRENT_SEASON, date: { lte: new Date() } },
    orderBy: { round: "asc" },
  });

  let total = 0;
  for (const race of races) {
    total += await syncResultsForRound(race.round);
  }
  return total;
}
