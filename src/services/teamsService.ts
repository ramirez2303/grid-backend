import { prisma } from "../config/database.js";

import type { TeamResponse, TeamListItem } from "../types/team.js";

export async function getAllTeams(): Promise<TeamListItem[]> {
  const teams = await prisma.team.findMany({
    include: { _count: { select: { drivers: true } } },
    orderBy: { name: "asc" },
  });

  return teams.map((team) => ({
    id: team.id,
    name: team.name,
    fullName: team.fullName,
    colorPrimary: team.colorPrimary,
    engine: team.engine,
    championships: team.championships,
    wins: team.wins,
    driverCount: team._count.drivers,
  }));
}

export async function getTeamById(teamId: string): Promise<TeamResponse | null> {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      drivers: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          abbreviation: true,
          number: true,
          nationality: true,
        },
      },
    },
  });

  if (!team) return null;

  return {
    id: team.id,
    name: team.name,
    fullName: team.fullName,
    colorPrimary: team.colorPrimary,
    colorSecondary: team.colorSecondary,
    base: team.base,
    teamPrincipal: team.teamPrincipal,
    engine: team.engine,
    firstSeason: team.firstSeason,
    championships: team.championships,
    wins: team.wins,
    podiums: team.podiums,
    bio: team.bio,
    drivers: team.drivers,
  };
}
