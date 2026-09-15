import { Question } from "./types";

const SKILL_KEY = "igate_skill";
const DEFAULT_RATING = 1200;
const DIFFICULTY_RATING: Record<string, number> = { easy: 1000, medium: 1300, hard: 1600 };
const K_FACTOR = 32;

export interface SkillMap {
  [topic: string]: number;
}

export function loadSkills(): SkillMap {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(SKILL_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function saveSkills(skills: SkillMap) {
  localStorage.setItem(SKILL_KEY, JSON.stringify(skills));
}

export function getRating(skills: SkillMap, topic: string): number {
  return skills[topic] ?? DEFAULT_RATING;
}

/** Standard Elo expected-score formula. */
function expectedScore(playerRating: number, opponentRating: number): number {
  return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
}

/**
 * Update a topic's skill rating after answering one question, using the
 * question's difficulty as an approximate "opponent" rating (Elo-style).
 */
export function updateSkill(skills: SkillMap, topic: string, difficulty: string, correct: boolean): SkillMap {
  const current = getRating(skills, topic);
  const opponent = DIFFICULTY_RATING[difficulty] ?? DIFFICULTY_RATING.medium;
  const expected = expectedScore(current, opponent);
  const actual = correct ? 1 : 0;
  const next = current + K_FACTOR * (actual - expected);
  return { ...skills, [topic]: Math.round(next) };
}

/** Maps a skill rating to the difficulty band expected to give ~70% success odds. */
export function targetDifficultyFor(rating: number): string[] {
  if (rating < 1150) return ["easy"];
  if (rating < 1450) return ["easy", "medium"];
  return ["medium", "hard"];
}

/**
 * Adaptive selection: pull questions whose difficulty roughly matches the
 * learner's current rating for each question's topic (or a mixed pool of
 * topics when no single topic is specified), aiming for the "zone of
 * proximal development" (~70% expected success) rather than pure random.
 */
export function pickAdaptive(allQuestions: Question[], skills: SkillMap, count: number): Question[] {
  const scored = allQuestions.map((q) => {
    const rating = getRating(skills, q.topic);
    const band = targetDifficultyFor(rating);
    const inBand = band.includes(q.difficulty);
    return { q, weight: inBand ? 3 : 1 };
  });

  const pool: Question[] = [];
  scored.forEach(({ q, weight }) => {
    for (let i = 0; i < weight; i++) pool.push(q);
  });

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const seen = new Set<string>();
  const result: Question[] = [];
  for (const q of shuffled) {
    if (seen.has(q.id)) continue;
    seen.add(q.id);
    result.push(q);
    if (result.length >= count) break;
  }
  return result;
}
