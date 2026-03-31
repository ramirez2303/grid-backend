import { syncCalendar } from "../services/syncCalendarService.js";
import { syncAllResults } from "../services/syncResultsService.js";
import { syncDriverStandings, syncConstructorStandings } from "../services/syncStandingsService.js";
import { syncCircuitRecords, syncCircuitEditions } from "../services/syncCircuitDataService.js";
import { syncRecords } from "../services/recordsService.js";
import { syncTriviaQuestions } from "../services/triviaService.js";

export interface SyncResult {
  calendar: number;
  results: number;
  driverStandings: number;
  constructorStandings: number;
  circuitRecords: number;
  circuitEditions: number;
  records: number;
  trivia: number;
  durationMs: number;
}

export async function runFullSync(): Promise<SyncResult> {
  const start = Date.now();
  console.log("Starting full data sync...\n");

  const calendar = await syncCalendar();
  const results = await syncAllResults();
  const driverStandings = await syncDriverStandings();
  const constructorStandings = await syncConstructorStandings();
  const circuitRecords = await syncCircuitRecords();
  const circuitEditions = await syncCircuitEditions();
  const records = await syncRecords();
  const trivia = await syncTriviaQuestions();

  const durationMs = Date.now() - start;
  console.log(`\nFull sync completed in ${durationMs}ms`);

  return { calendar, results, driverStandings, constructorStandings, circuitRecords, circuitEditions, records, trivia, durationMs };
}
