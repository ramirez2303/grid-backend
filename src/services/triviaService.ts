import { prisma } from "../config/database.js";

import type { TriviaQuestionItem } from "../types/trivia.js";

export async function getRandomQuestions(count: number): Promise<TriviaQuestionItem[]> {
  const all = await prisma.triviaQuestion.findMany();
  const shuffled = all.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((q) => ({
    id: q.id, question: q.question, options: q.options,
    correctAnswer: q.correctAnswer, category: q.category, difficulty: q.difficulty,
  }));
}

const QUESTIONS = [
  { question: "¿Quién tiene más victorias en la historia de la F1?", options: ["Michael Schumacher", "Lewis Hamilton", "Max Verstappen", "Ayrton Senna"], correctAnswer: 1, category: "records", difficulty: "easy" },
  { question: "¿Cuántos campeonatos mundiales ganó Juan Manuel Fangio?", options: ["3", "4", "5", "7"], correctAnswer: 2, category: "history", difficulty: "medium" },
  { question: "¿En qué año Ayrton Senna ganó su primer campeonato mundial?", options: ["1985", "1988", "1990", "1991"], correctAnswer: 1, category: "history", difficulty: "medium" },
  { question: "¿Qué equipo ganó el primer campeonato de constructores de F1 en 1958?", options: ["Ferrari", "Vanwall", "Maserati", "Mercedes"], correctAnswer: 1, category: "history", difficulty: "hard" },
  { question: "¿En qué circuito Max Verstappen se convirtió en el piloto más joven en ganar una carrera?", options: ["Monza", "Silverstone", "Barcelona", "Spa"], correctAnswer: 2, category: "records", difficulty: "medium" },
  { question: "¿Cuántos campeonatos consecutivos ganó Michael Schumacher con Ferrari?", options: ["3", "4", "5", "6"], correctAnswer: 2, category: "history", difficulty: "easy" },
  { question: "¿Qué piloto ganó 6 veces el GP de Mónaco?", options: ["Alain Prost", "Ayrton Senna", "Lewis Hamilton", "Michael Schumacher"], correctAnswer: 1, category: "circuits", difficulty: "easy" },
  { question: "¿Cuál es el circuito más largo del calendario actual de F1?", options: ["Monza", "Silverstone", "Spa-Francorchamps", "Jeddah"], correctAnswer: 2, category: "circuits", difficulty: "easy" },
  { question: "¿En qué año se introdujo el Halo en la F1?", options: ["2016", "2017", "2018", "2019"], correctAnswer: 2, category: "technical", difficulty: "medium" },
  { question: "¿Qué significa DRS en Fórmula 1?", options: ["Drag Reduction System", "Dynamic Race System", "Driver Response System", "Downforce Reduction System"], correctAnswer: 0, category: "technical", difficulty: "easy" },
  { question: "¿Cuál fue el primer GP de F1 de la historia?", options: ["Mónaco 1950", "Silverstone 1950", "Monza 1950", "Nürburgring 1950"], correctAnswer: 1, category: "history", difficulty: "medium" },
  { question: "¿Qué equipo tiene más campeonatos de constructores?", options: ["McLaren", "Mercedes", "Red Bull", "Ferrari"], correctAnswer: 3, category: "records", difficulty: "easy" },
  { question: "¿Cuántas RPM alcanza un motor de F1?", options: ["10.000", "12.000", "15.000+", "20.000+"], correctAnswer: 2, category: "technical", difficulty: "medium" },
  { question: "¿Qué piloto tiene el récord de más poles en F1?", options: ["Ayrton Senna", "Michael Schumacher", "Max Verstappen", "Lewis Hamilton"], correctAnswer: 3, category: "records", difficulty: "easy" },
  { question: "¿En qué GP Jenson Button remontó desde el último lugar hasta ganar?", options: ["Brasil 2009", "Canadá 2011", "Hungría 2006", "Australia 2010"], correctAnswer: 1, category: "races", difficulty: "hard" },
  { question: "¿Qué split de potencia tiene el reglamento 2026?", options: ["70% combustión / 30% eléctrico", "60% / 40%", "50% / 50%", "80% / 20%"], correctAnswer: 2, category: "2026", difficulty: "medium" },
  { question: "¿Cuál es la velocidad media de carrera más alta del calendario F1?", options: ["Silverstone", "Monza", "Spa", "Jeddah"], correctAnswer: 1, category: "circuits", difficulty: "hard" },
  { question: "¿Qué equipo nuevo se suma a la F1 en 2026 como 11vo?", options: ["Andretti", "Cadillac", "Porsche", "Toyota"], correctAnswer: 1, category: "2026", difficulty: "easy" },
  { question: "¿Cuántos compuestos de neumáticos ofrece Pirelli para seco?", options: ["2", "3", "4", "5"], correctAnswer: 1, category: "technical", difficulty: "medium" },
  { question: "¿Qué piloto disputó más GPs en la historia?", options: ["Fernando Alonso", "Lewis Hamilton", "Kimi Räikkönen", "Rubens Barrichello"], correctAnswer: 2, category: "records", difficulty: "hard" },
];

export async function syncTriviaQuestions(): Promise<number> {
  let synced = 0;
  for (const q of QUESTIONS) {
    const existing = await prisma.triviaQuestion.findFirst({ where: { question: q.question } });
    if (!existing) {
      await prisma.triviaQuestion.create({ data: q });
      synced++;
    }
  }
  console.log(`Trivia questions synced: ${synced}`);
  return synced;
}
