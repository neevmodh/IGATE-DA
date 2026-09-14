const INTERVALS_DAYS = [1, 3, 7, 14, 30];

export function nextDueDate(lastMissedAt: string, timesMissed: number): Date {
  const idx = Math.min(timesMissed - 1, INTERVALS_DAYS.length - 1);
  const days = INTERVALS_DAYS[Math.max(idx, 0)];
  const base = new Date(lastMissedAt);
  base.setDate(base.getDate() + days);
  return base;
}

export function isDue(lastMissedAt: string, timesMissed: number): boolean {
  return nextDueDate(lastMissedAt, timesMissed).getTime() <= Date.now();
}
