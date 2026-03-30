import { prisma } from "../config/database.js";

import type { CircuitResponse, CircuitListItem } from "../types/circuit.js";

export async function getAllCircuits(): Promise<CircuitListItem[]> {
  const circuits = await prisma.circuit.findMany({
    orderBy: { name: "asc" },
  });

  return circuits.map((circuit) => ({
    id: circuit.id,
    name: circuit.name,
    country: circuit.country,
    city: circuit.city,
    latitude: circuit.latitude,
    longitude: circuit.longitude,
    length: circuit.length,
    turns: circuit.turns,
    type: circuit.type,
  }));
}

export async function getCircuitById(circuitId: string): Promise<CircuitResponse | null> {
  const circuit = await prisma.circuit.findUnique({
    where: { id: circuitId },
  });

  if (!circuit) return null;

  return {
    id: circuit.id,
    name: circuit.name,
    country: circuit.country,
    city: circuit.city,
    latitude: circuit.latitude,
    longitude: circuit.longitude,
    length: circuit.length,
    turns: circuit.turns,
    drsZones: circuit.drsZones,
    type: circuit.type,
    lapRecordTime: circuit.lapRecordTime,
    lapRecordDriver: circuit.lapRecordDriver,
    lapRecordYear: circuit.lapRecordYear,
    numberOfLaps: circuit.numberOfLaps,
    raceDistance: circuit.raceDistance,
    firstGrandPrix: circuit.firstGrandPrix,
    totalEditions: circuit.totalEditions,
    description: circuit.description,
  };
}
