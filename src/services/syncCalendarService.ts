import axios from "axios";
import { prisma } from "../config/database.js";
import { JOLPICA_BASE_URL, CURRENT_SEASON } from "../config/apis.js";
import { jolpicaToGridCircuitId } from "../config/circuitMapping.js";

import type { JolpicaRace } from "../types/jolpica.js";

interface JolpicaCalendarResponse {
  MRData: {
    RaceTable: { season: string; Races: JolpicaRace[] };
  };
}

export async function syncCalendar(): Promise<number> {
  const url = `${JOLPICA_BASE_URL}/${CURRENT_SEASON}.json`;
  const { data } = await axios.get<JolpicaCalendarResponse>(url);
  const races = data.MRData.RaceTable.Races;

  let synced = 0;

  for (const race of races) {
    const circuitId = jolpicaToGridCircuitId[race.Circuit.circuitId];
    if (!circuitId) {
      console.warn(`Unknown circuit: ${race.Circuit.circuitId}, skipping`);
      continue;
    }

    const raceDate = new Date(`${race.date}T${race.time ?? "00:00:00Z"}`);
    const sprintDate = race.Sprint
      ? new Date(`${race.Sprint.date}T${race.Sprint.time}`)
      : null;

    await prisma.race.upsert({
      where: { season_round: { season: CURRENT_SEASON, round: Number(race.round) } },
      update: {
        name: race.raceName,
        circuitId,
        date: raceDate,
        time: race.time ?? null,
        sprintDate,
        sprintTime: race.Sprint?.time ?? null,
      },
      create: {
        season: CURRENT_SEASON,
        round: Number(race.round),
        name: race.raceName,
        circuitId,
        date: raceDate,
        time: race.time ?? null,
        sprintDate,
        sprintTime: race.Sprint?.time ?? null,
      },
    });
    synced++;
  }

  console.log(`Calendar synced: ${synced} races`);
  return synced;
}
