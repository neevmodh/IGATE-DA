"use client";

import { useEffect, useState } from "react";
import { Attempt } from "@/lib/types";

const GOAL_KEY = "igate_daily_goal";

function computeStreak(history: Attempt[]): number {
  const days = new Set(history.map((h) => new Date(h.date).toDateString()));
  let streak = 0;
  const cursor = new Date();
  while (days.has(cursor.toDateString())) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function computeBadges(history: Attempt[]): string[] {
  const badges: string[] = [];
  const totalQ = history.reduce((s, h) => s + h.total_questions, 0);
  if (totalQ >= 1) badges.push("First test taken");
  if (totalQ >= 100) badges.push("100 questions answered");
  if (totalQ >= 500) badges.push("500 questions answered");
  if (history.some((h) => h.scope === "full")) badges.push("Full mock completed");
  const streak = computeStreak(history);
  if (streak >= 7) badges.push("7-day streak");
  if (streak >= 30) badges.push("30-day streak");
  return badges;
}

export default function MotivationBar() {
  const [history, setHistory] = useState<Attempt[]>([]);
  const [goal, setGoal] = useState(20);
  const [solvedToday, setSolvedToday] = useState(0);

  useEffect(() => {
    const raw = localStorage.getItem("igate_history");
    const h: Attempt[] = raw ? JSON.parse(raw) : [];
    setHistory(h);
    const today = new Date().toDateString();
    const todayCount = h
      .filter((a) => new Date(a.date).toDateString() === today)
      .reduce((s, a) => s + a.attempted, 0);
    setSolvedToday(todayCount);
    const g = localStorage.getItem(GOAL_KEY);
    if (g) setGoal(Number(g));
  }, []);

  function updateGoal(v: number) {
    setGoal(v);
    localStorage.setItem(GOAL_KEY, String(v));
  }

  const streak = computeStreak(history);
  const badges = computeBadges(history);
  const pct = Math.min((solvedToday / goal) * 100, 100);

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">🔥 {streak}-day streak</span>
        <span className="text-xs text-zinc-500">{badges.length} badge{badges.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="flex items-center gap-2 mb-2 text-xs">
        <span>Daily goal:</span>
        <input
          type="number"
          value={goal}
          onChange={(e) => updateGoal(Number(e.target.value))}
          className="w-14 rounded border border-zinc-300 dark:border-zinc-700 bg-transparent px-1 py-0.5"
        />
        <span>questions ({solvedToday}/{goal} today)</span>
      </div>
      <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden mb-2">
        <div className="h-full bg-orange-500 transition-all" style={{ width: `${pct}%` }} />
      </div>

      {badges.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {badges.map((b) => (
            <span key={b} className="text-[10px] rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-0.5">
              🏅 {b}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
