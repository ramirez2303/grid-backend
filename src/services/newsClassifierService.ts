const teamKeywords: Record<string, string[]> = {
  mclaren: ["mclaren", "norris", "piastri"],
  mercedes: ["mercedes", "russell", "antonelli"],
  "red-bull": ["red bull", "redbull", "verstappen", "hadjar"],
  ferrari: ["ferrari", "leclerc", "hamilton"],
  williams: ["williams", "sainz", "albon"],
  "racing-bulls": ["racing bulls", "lawson", "lindblad"],
  "aston-martin": ["aston martin", "alonso", "stroll"],
  haas: ["haas", "bearman", "ocon"],
  audi: ["audi", "hulkenberg", "hülkenberg", "bortoleto"],
  alpine: ["alpine", "gasly", "colapinto"],
  cadillac: ["cadillac", "perez", "pérez", "bottas"],
};

const techKeywords = [
  "fia", "reglamento", "regulation", "technical", "tecnico", "aerodynamic",
  "aerodinamica", "power unit", "engine", "drs", "ground effect", "floor",
  "sidepod", "diffuser", "suspension", "upgrade", "development",
];

export function classifyNews(title: string, summary: string): string[] {
  const text = `${title} ${summary}`.toLowerCase();
  const topics: string[] = [];

  for (const [teamId, keywords] of Object.entries(teamKeywords)) {
    if (keywords.some((kw) => text.includes(kw))) {
      topics.push(teamId);
    }
  }

  if (techKeywords.some((kw) => text.includes(kw))) {
    topics.push("tecnico");
  }

  if (topics.length === 0) topics.push("general");

  return topics;
}
