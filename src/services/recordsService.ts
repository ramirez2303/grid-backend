import { prisma } from "../config/database.js";

import type { RecordItem } from "../types/trivia.js";

export async function getAllRecords(): Promise<RecordItem[]> {
  return prisma.record.findMany({ orderBy: { category: "asc" } });
}

/** Hardcoded all-time records — verified, don't change often */
const KNOWN_RECORDS = [
  { category: "most-wins-driver", value: "105", holder: "Lewis Hamilton", detail: "2007-presente" },
  { category: "most-poles-driver", value: "104", holder: "Lewis Hamilton", detail: "2007-presente" },
  { category: "most-podiums-driver", value: "202", holder: "Lewis Hamilton", detail: "2007-presente" },
  { category: "most-championships-driver", value: "7", holder: "Lewis Hamilton / Michael Schumacher", detail: "Récord compartido" },
  { category: "longest-win-streak", value: "10", holder: "Max Verstappen", detail: "2023 — del GP de Miami al GP de Italia" },
  { category: "youngest-winner", value: "18 años 228 días", holder: "Max Verstappen", detail: "GP de España 2016" },
  { category: "biggest-comeback", value: "Último → 1°", holder: "Jenson Button", detail: "GP de Canadá 2011" },
  { category: "most-wins-constructor", value: "247", holder: "Ferrari", detail: "1950-presente" },
  { category: "most-championships-constructor", value: "16", holder: "Ferrari", detail: "1950-presente" },
];

export async function syncRecords(): Promise<number> {
  let synced = 0;
  for (const record of KNOWN_RECORDS) {
    await prisma.record.upsert({
      where: { category: record.category },
      update: { value: record.value, holder: record.holder, detail: record.detail },
      create: record,
    });
    synced++;
  }
  console.log(`Records synced: ${synced}`);
  return synced;
}
