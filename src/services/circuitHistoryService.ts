import axios from "axios";
import { JOLPICA_BASE_URL } from "../config/apis.js";
import { gridToJolpicaCircuitId } from "../config/circuitMapping.js";

import type { CircuitWinner } from "../types/circuitHistory.js";

interface JolpicaWinnersResponse {
  MRData: {
    RaceTable: {
      Races: Array<{
        season: string;
        Results: Array<{
          Driver: { givenName: string; familyName: string };
          Constructor: { name: string };
          Time?: { time: string };
        }>;
      }>;
    };
  };
}

export async function getCircuitWinners(circuitId: string): Promise<CircuitWinner[]> {
  const jolpicaId = gridToJolpicaCircuitId[circuitId];
  if (!jolpicaId) return [];

  const url = `${JOLPICA_BASE_URL}/circuits/${jolpicaId}/results/1.json?limit=10`;
  const { data } = await axios.get<JolpicaWinnersResponse>(url);
  const races = data.MRData.RaceTable.Races;

  return races
    .map((race) => {
      const winner = race.Results[0];
      if (!winner) return null;
      return {
        year: Number(race.season),
        driverName: `${winner.Driver.givenName} ${winner.Driver.familyName}`,
        teamName: winner.Constructor.name,
        time: winner.Time?.time ?? null,
      };
    })
    .filter((w): w is CircuitWinner => w !== null)
    .reverse();
}
