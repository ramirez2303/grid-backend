/**
 * Maps Jolpica circuit IDs (underscore format) to our DB circuit IDs.
 * Jolpica uses Wikipedia-style IDs, we use short hyphenated slugs.
 */
export const jolpicaToGridCircuitId: Record<string, string> = {
  albert_park: "melbourne",
  shanghai: "shanghai",
  suzuka: "suzuka",
  bahrain: "bahrain",
  jeddah: "jeddah",
  miami: "miami",
  imola: "imola",
  monaco: "monaco",
  catalunya: "barcelona",
  villeneuve: "montreal",
  red_bull_ring: "spielberg",
  silverstone: "silverstone",
  spa: "spa",
  zandvoort: "zandvoort",
  monza: "monza",
  baku: "baku",
  marina_bay: "singapore",
  americas: "austin",
  rodriguez: "mexico-city",
  interlagos: "interlagos",
  losail: "lusail",
  yas_marina: "yas-marina",
  hungaroring: "budapest",
  madring: "madrid",
  vegas: "las-vegas",
};

/** Inverse mapping: our circuit ID → Jolpica circuit ID */
export const gridToJolpicaCircuitId: Record<string, string> = Object.fromEntries(
  Object.entries(jolpicaToGridCircuitId).map(([jolpica, grid]) => [grid, jolpica]),
);

export const jolpicaToGridConstructorId: Record<string, string> = {
  mclaren: "mclaren",
  mercedes: "mercedes",
  red_bull: "red-bull",
  ferrari: "ferrari",
  williams: "williams",
  rb: "racing-bulls",
  aston_martin: "aston-martin",
  haas: "haas",
  audi: "audi",
  alpine: "alpine",
  cadillac: "cadillac",
};

export const jolpicaToGridDriverId: Record<string, string> = {
  norris: "norris",
  piastri: "piastri",
  russell: "russell",
  antonelli: "antonelli",
  max_verstappen: "verstappen",
  hadjar: "hadjar",
  leclerc: "leclerc",
  hamilton: "hamilton",
  sainz: "sainz",
  albon: "albon",
  lawson: "lawson",
  lindblad: "lindblad",
  alonso: "alonso",
  stroll: "stroll",
  bearman: "bearman",
  ocon: "ocon",
  hulkenberg: "hulkenberg",
  bortoleto: "bortoleto",
  gasly: "gasly",
  colapinto: "colapinto",
  perez: "perez",
  bottas: "bottas",
};
