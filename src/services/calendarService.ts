import { prisma } from "../config/database.js";
import { CURRENT_SEASON } from "../config/apis.js";

import type { CalendarRace } from "../types/result.js";

export async function getCalendar(): Promise<CalendarRace[]> {
  const races = await prisma.race.findMany({
    where: { season: CURRENT_SEASON },
    include: {
      circuit: true,
      _count: { select: { results: true } },
    },
    orderBy: { round: "asc" },
  });

  return races.map((race) => ({
    season: race.season,
    round: race.round,
    name: race.name,
    circuitId: race.circuitId,
    circuitName: race.circuit.name,
    country: race.circuit.country,
    city: race.circuit.city,
    date: race.date.toISOString(),
    time: race.time,
    hasResults: race._count.results > 0,
  }));
}
