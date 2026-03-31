import { prisma } from "../config/database.js";

export interface GlossaryTermResponse {
  id: string;
  term: string;
  definition: string;
  category: string | null;
}

export async function getAllGlossaryTerms(): Promise<GlossaryTermResponse[]> {
  return prisma.glossaryTerm.findMany({ orderBy: { term: "asc" } });
}
