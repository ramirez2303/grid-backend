import { prisma } from "../config/database.js";

import type { DriverResponse, DriverListItem } from "../types/driver.js";

export async function getAllDrivers(): Promise<DriverListItem[]> {
  const drivers = await prisma.driver.findMany({
    include: {
      team: { select: { id: true, name: true, colorPrimary: true } },
    },
    orderBy: { lastName: "asc" },
  });

  return drivers.map((driver) => ({
    id: driver.id,
    firstName: driver.firstName,
    lastName: driver.lastName,
    abbreviation: driver.abbreviation,
    number: driver.number,
    nationality: driver.nationality,
    championships: driver.championships,
    wins: driver.wins,
    podiums: driver.podiums,
    team: driver.team,
  }));
}

export async function getDriverById(driverId: string): Promise<DriverResponse | null> {
  const driver = await prisma.driver.findUnique({
    where: { id: driverId },
    include: {
      team: { select: { id: true, name: true, colorPrimary: true } },
    },
  });

  if (!driver) return null;

  return {
    id: driver.id,
    firstName: driver.firstName,
    lastName: driver.lastName,
    abbreviation: driver.abbreviation,
    number: driver.number,
    nationality: driver.nationality,
    dateOfBirth: driver.dateOfBirth?.toISOString() ?? null,
    championships: driver.championships,
    wins: driver.wins,
    podiums: driver.podiums,
    poles: driver.poles,
    fastestLaps: driver.fastestLaps,
    firstSeason: driver.firstSeason,
    team: driver.team,
  };
}
