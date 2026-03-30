import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { teamsData } from "./seed-data/teams.js";
import { driversData } from "./seed-data/drivers.js";
import { circuitsData } from "./seed-data/circuits.js";

const databaseUrl = process.env["DATABASE_URL"];
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required for seeding");
}

const pool = new pg.Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedTeams(): Promise<void> {
  console.log("Seeding teams...");
  for (const team of teamsData) {
    await prisma.team.upsert({
      where: { id: team.id },
      update: team,
      create: team,
    });
  }
  console.log(`  ${teamsData.length} teams seeded.`);
}

async function seedDrivers(): Promise<void> {
  console.log("Seeding drivers...");
  for (const driver of driversData) {
    const { dateOfBirth, ...rest } = driver;
    await prisma.driver.upsert({
      where: { id: driver.id },
      update: { ...rest, dateOfBirth: new Date(dateOfBirth) },
      create: { ...rest, dateOfBirth: new Date(dateOfBirth) },
    });
  }
  console.log(`  ${driversData.length} drivers seeded.`);
}

async function seedCircuits(): Promise<void> {
  console.log("Seeding circuits...");
  for (const circuit of circuitsData) {
    await prisma.circuit.upsert({
      where: { id: circuit.id },
      update: circuit,
      create: circuit,
    });
  }
  console.log(`  ${circuitsData.length} circuits seeded.`);
}

async function main(): Promise<void> {
  console.log("Starting GRID seed...\n");
  await seedTeams();
  await seedDrivers();
  await seedCircuits();
  console.log("\nSeed completed successfully!");
}

main()
  .catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
