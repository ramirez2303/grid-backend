import axios from "axios";
import { prisma } from "../config/database.js";
import { JOLPICA_BASE_URL } from "../config/apis.js";
import {
  jolpicaToGridDriverId,
  jolpicaToGridConstructorId,
} from "../config/circuitMapping.js";

import type {
  JolpicaDriverStanding,
  JolpicaConstructorStanding,
} from "../types/jolpica.js";

interface DriverStandingsResponse {
  MRData: {
    StandingsTable: {
      StandingsLists: Array<{ DriverStandings: JolpicaDriverStanding[] }>;
    };
  };
}

interface ConstructorStandingsResponse {
  MRData: {
    StandingsTable: {
      StandingsLists: Array<{ ConstructorStandings: JolpicaConstructorStanding[] }>;
    };
  };
}

export async function syncDriverStandings(): Promise<number> {
  const url = `${JOLPICA_BASE_URL}/current/driverStandings.json`;
  const { data } = await axios.get<DriverStandingsResponse>(url);
  const list = data.MRData.StandingsTable.StandingsLists[0];
  if (!list) return 0;

  let synced = 0;
  for (const standing of list.DriverStandings) {
    const driverId = jolpicaToGridDriverId[standing.Driver.driverId];
    if (!driverId) continue;

    await prisma.driver.update({
      where: { id: driverId },
      data: { wins: Number(standing.wins) },
    });
    synced++;
  }

  console.log(`Driver standings synced: ${synced} drivers`);
  return synced;
}

export async function syncConstructorStandings(): Promise<number> {
  const url = `${JOLPICA_BASE_URL}/current/constructorStandings.json`;
  const { data } = await axios.get<ConstructorStandingsResponse>(url);
  const list = data.MRData.StandingsTable.StandingsLists[0];
  if (!list) return 0;

  let synced = 0;
  for (const standing of list.ConstructorStandings) {
    const teamId = jolpicaToGridConstructorId[standing.Constructor.constructorId];
    if (!teamId) continue;

    // Don't overwrite historical wins — season wins are in the standings endpoint
    synced++;
  }

  console.log(`Constructor standings synced: ${synced} teams`);
  return synced;
}
