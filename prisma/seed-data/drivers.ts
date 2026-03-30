export const driversData = [
  // McLaren
  { id: "norris", firstName: "Lando", lastName: "Norris", abbreviation: "NOR", number: 4, nationality: "British", dateOfBirth: "1999-11-13", teamId: "mclaren", championships: 1, wins: 12, podiums: 30, poles: 10, fastestLaps: 8, firstSeason: 2019 },
  { id: "piastri", firstName: "Oscar", lastName: "Piastri", abbreviation: "PIA", number: 81, nationality: "Australian", dateOfBirth: "2001-04-06", teamId: "mclaren", championships: 0, wins: 4, podiums: 16, poles: 3, fastestLaps: 3, firstSeason: 2023 },

  // Mercedes
  { id: "russell", firstName: "George", lastName: "Russell", abbreviation: "RUS", number: 63, nationality: "British", dateOfBirth: "1998-02-15", teamId: "mercedes", championships: 0, wins: 5, podiums: 26, poles: 5, fastestLaps: 7, firstSeason: 2019 },
  { id: "antonelli", firstName: "Kimi", lastName: "Antonelli", abbreviation: "ANT", number: 12, nationality: "Italian", dateOfBirth: "2006-08-25", teamId: "mercedes", championships: 0, wins: 0, podiums: 1, poles: 0, fastestLaps: 0, firstSeason: 2025 },

  // Red Bull
  { id: "verstappen", firstName: "Max", lastName: "Verstappen", abbreviation: "VER", number: 1, nationality: "Dutch", dateOfBirth: "1997-09-30", teamId: "red-bull", championships: 4, wins: 63, podiums: 113, poles: 40, fastestLaps: 33, firstSeason: 2015 },
  { id: "hadjar", firstName: "Isack", lastName: "Hadjar", abbreviation: "HAD", number: 6, nationality: "French", dateOfBirth: "2005-09-28", teamId: "red-bull", championships: 0, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, firstSeason: 2026 },

  // Ferrari
  { id: "leclerc", firstName: "Charles", lastName: "Leclerc", abbreviation: "LEC", number: 16, nationality: "Monegasque", dateOfBirth: "1997-10-16", teamId: "ferrari", championships: 0, wins: 9, podiums: 41, poles: 26, fastestLaps: 8, firstSeason: 2018 },
  { id: "hamilton", firstName: "Lewis", lastName: "Hamilton", abbreviation: "HAM", number: 44, nationality: "British", dateOfBirth: "1985-01-07", teamId: "ferrari", championships: 7, wins: 105, podiums: 202, poles: 104, fastestLaps: 67, firstSeason: 2007 },

  // Williams
  { id: "sainz", firstName: "Carlos", lastName: "Sainz", abbreviation: "SAI", number: 55, nationality: "Spanish", dateOfBirth: "1994-09-01", teamId: "williams", championships: 0, wins: 4, podiums: 25, poles: 6, fastestLaps: 4, firstSeason: 2015 },
  { id: "albon", firstName: "Alex", lastName: "Albon", abbreviation: "ALB", number: 23, nationality: "Thai", dateOfBirth: "1996-03-23", teamId: "williams", championships: 0, wins: 0, podiums: 2, poles: 0, fastestLaps: 0, firstSeason: 2019 },

  // Racing Bulls
  { id: "lawson", firstName: "Liam", lastName: "Lawson", abbreviation: "LAW", number: 30, nationality: "New Zealander", dateOfBirth: "2002-02-11", teamId: "racing-bulls", championships: 0, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, firstSeason: 2024 },
  { id: "lindblad", firstName: "Arvid", lastName: "Lindblad", abbreviation: "LIN", number: 27, nationality: "British", dateOfBirth: "2006-10-17", teamId: "racing-bulls", championships: 0, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, firstSeason: 2026 },

  // Aston Martin
  { id: "alonso", firstName: "Fernando", lastName: "Alonso", abbreviation: "ALO", number: 14, nationality: "Spanish", dateOfBirth: "1981-07-29", teamId: "aston-martin", championships: 2, wins: 32, podiums: 106, poles: 22, fastestLaps: 24, firstSeason: 2001 },
  { id: "stroll", firstName: "Lance", lastName: "Stroll", abbreviation: "STR", number: 18, nationality: "Canadian", dateOfBirth: "1998-10-29", teamId: "aston-martin", championships: 0, wins: 0, podiums: 3, poles: 1, fastestLaps: 0, firstSeason: 2017 },

  // Haas
  { id: "bearman", firstName: "Oliver", lastName: "Bearman", abbreviation: "BEA", number: 87, nationality: "British", dateOfBirth: "2005-05-08", teamId: "haas", championships: 0, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, firstSeason: 2025 },
  { id: "ocon", firstName: "Esteban", lastName: "Ocon", abbreviation: "OCO", number: 31, nationality: "French", dateOfBirth: "1996-09-17", teamId: "haas", championships: 0, wins: 1, podiums: 4, poles: 0, fastestLaps: 0, firstSeason: 2016 },

  // Audi
  { id: "hulkenberg", firstName: "Nico", lastName: "Hülkenberg", abbreviation: "HUL", number: 27, nationality: "German", dateOfBirth: "1987-08-19", teamId: "audi", championships: 0, wins: 0, podiums: 0, poles: 1, fastestLaps: 2, firstSeason: 2010 },
  { id: "bortoleto", firstName: "Gabriel", lastName: "Bortoleto", abbreviation: "BOR", number: 5, nationality: "Brazilian", dateOfBirth: "2004-10-14", teamId: "audi", championships: 0, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, firstSeason: 2025 },

  // Alpine
  { id: "gasly", firstName: "Pierre", lastName: "Gasly", abbreviation: "GAS", number: 10, nationality: "French", dateOfBirth: "1996-02-07", teamId: "alpine", championships: 0, wins: 1, podiums: 5, poles: 0, fastestLaps: 3, firstSeason: 2017 },
  { id: "colapinto", firstName: "Franco", lastName: "Colapinto", abbreviation: "COL", number: 43, nationality: "Argentine", dateOfBirth: "2003-05-27", teamId: "alpine", championships: 0, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, firstSeason: 2024 },

  // Cadillac
  { id: "perez", firstName: "Sergio", lastName: "Pérez", abbreviation: "PER", number: 11, nationality: "Mexican", dateOfBirth: "1990-01-26", teamId: "cadillac", championships: 0, wins: 6, podiums: 39, poles: 3, fastestLaps: 11, firstSeason: 2011 },
  { id: "bottas", firstName: "Valtteri", lastName: "Bottas", abbreviation: "BOT", number: 77, nationality: "Finnish", dateOfBirth: "1989-08-28", teamId: "cadillac", championships: 0, wins: 10, podiums: 67, poles: 20, fastestLaps: 19, firstSeason: 2013 },
] as const;
