import axios from "axios";
import { prisma } from "../config/database.js";
import { JOLPICA_BASE_URL } from "../config/apis.js";
import { gridToJolpicaCircuitId } from "../config/circuitMapping.js";

interface JolpicaFastestLapResponse {
  MRData: {
    RaceTable: {
      Races: Array<{
        season: string;
        Results: Array<{
          Driver: { givenName: string; familyName: string };
          FastestLap?: { Time: { time: string } };
        }>;
      }>;
    };
  };
}

interface JolpicaWinnersResponse {
  MRData: {
    RaceTable: {
      Races: Array<{
        season: string;
        Results: Array<{
          laps: string;
          Driver: { givenName: string; familyName: string };
        }>;
      }>;
    };
  };
}

export async function syncCircuitRecords(): Promise<number> {
  const circuits = await prisma.circuit.findMany();
  let synced = 0;

  for (const circuit of circuits) {
    const jolpicaId = gridToJolpicaCircuitId[circuit.id];
    if (!jolpicaId) continue;

    try {
      const url = `${JOLPICA_BASE_URL}/circuits/${jolpicaId}/fastest/1/results/1.json`;
      const { data } = await axios.get<JolpicaFastestLapResponse>(url);
      const races = data.MRData.RaceTable.Races;
      if (races.length === 0) continue;

      const race = races[0]!;
      const result = race.Results[0];
      if (!result?.FastestLap) continue;

      await prisma.circuit.update({
        where: { id: circuit.id },
        data: {
          lapRecordTime: result.FastestLap.Time.time,
          lapRecordDriver: `${result.Driver.givenName} ${result.Driver.familyName}`,
          lapRecordYear: Number(race.season),
        },
      });
      synced++;
    } catch {
      console.warn(`Failed to sync lap record for ${circuit.id}`);
    }
  }

  console.log(`Circuit lap records synced: ${synced}`);
  return synced;
}

export async function syncCircuitEditions(): Promise<number> {
  const circuits = await prisma.circuit.findMany();
  let synced = 0;

  for (const circuit of circuits) {
    const jolpicaId = gridToJolpicaCircuitId[circuit.id];
    if (!jolpicaId) continue;

    try {
      const url = `${JOLPICA_BASE_URL}/circuits/${jolpicaId}/results/1.json?limit=100`;
      const { data } = await axios.get<JolpicaWinnersResponse>(url);
      const races = data.MRData.RaceTable.Races;
      if (races.length === 0) continue;

      const firstYear = Number(races[0]!.season);
      const totalEditions = races.length;
      const lastRace = races[races.length - 1]!;
      const laps = lastRace.Results[0] ? Number(lastRace.Results[0].laps) : null;
      const distance = laps && circuit.length
        ? `${(laps * circuit.length).toFixed(3)} km`
        : null;

      await prisma.circuit.update({
        where: { id: circuit.id },
        data: {
          firstGrandPrix: firstYear,
          totalEditions,
          numberOfLaps: laps,
          raceDistance: distance,
        },
      });
      synced++;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn(`Failed to sync editions for ${circuit.id}: ${msg}`);
    }
  }

  console.log(`Circuit editions synced: ${synced}`);
  return synced;
}
