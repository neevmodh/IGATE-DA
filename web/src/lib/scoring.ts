import { Question } from "./types";

export type UserAnswer = string[] | number | null;

export function scoreQuestion(q: Question, answer: UserAnswer): { marks: number; isCorrect: boolean; attempted: boolean } {
  const attempted = answer !== null && !(Array.isArray(answer) && answer.length === 0);
  if (!attempted) return { marks: 0, isCorrect: false, attempted: false };

  if (q.type === "MCQ") {
    const given = (answer as string[])[0];
    const isCorrect = given === q.correct_answer[0];
    if (isCorrect) return { marks: q.marks, isCorrect: true, attempted: true };
    const negPenalty = q.marks === 1 ? 1 / 3 : 2 / 3;
    return { marks: -negPenalty, isCorrect: false, attempted: true };
  }

  if (q.type === "MSQ") {
    const given = new Set(answer as string[]);
    const correct = new Set(q.correct_answer as string[]);
    const isCorrect = given.size === correct.size && [...given].every((v) => correct.has(v));
    return { marks: isCorrect ? q.marks : 0, isCorrect, attempted: true };
  }

  // NAT
  const given = answer as number;
  const target = q.correct_answer[0] as number;
  const isCorrect = Math.abs(given - target) < 0.01;
  return { marks: isCorrect ? q.marks : 0, isCorrect, attempted: true };
}
