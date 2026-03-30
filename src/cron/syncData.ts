import { syncCalendar } from "../services/syncCalendarService.js";
import { syncAllResults } from "../services/syncResultsService.js";
import { syncDriverStandings, syncConstructorStandings } from "../services/syncStandingsService.js";

export interface SyncResult {
  calendar: number;
  results: number;
  driverStandings: number;
  constructorStandings: number;
  durationMs: number;
}

export async function runFullSync(): Promise<SyncResult> {
  const start = Date.now();
  console.log("Starting full data sync...\n");

  const calendar = await syncCalendar();
  const results = await syncAllResults();
  const driverStandings = await syncDriverStandings();
  const constructorStandings = await syncConstructorStandings();

  const durationMs = Date.now() - start;
  console.log(`\nFull sync completed in ${durationMs}ms`);

  return { calendar, results, driverStandings, constructorStandings, durationMs };
}
