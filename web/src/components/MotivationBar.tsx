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
    <div className="rounded-2xl border border-border shadow-sm bg-surface p-6 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-ink-2 uppercase tracking-wide">Streak</span>
        <span className="display text-[26px] font-extrabold text-accent-ink flex items-baseline gap-1">
          {streak}
          <span className="text-[13px] font-semibold text-ink-3">days</span>
        </span>
      </div>

      <div className="flex gap-1.5">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full ${i < Math.min(streak, 7) ? "bg-accent" : "bg-border-soft"}`}
          />
        ))}
      </div>

      <div className="border-t border-border-soft pt-4">
        <div className="flex items-center justify-between text-[13px] mb-2">
          <span className="text-ink-2">Daily goal</span>
          <span className="font-semibold flex items-center gap-1">
            {solvedToday} /
            <input
              type="number"
              value={goal}
              onChange={(e) => updateGoal(Number(e.target.value))}
              className="w-10 rounded border border-border shadow-sm bg-transparent px-1 text-center"
            />
            Qs
          </span>
        </div>
        <div className="h-2 rounded-full bg-border-soft overflow-hidden">
          <div className="h-full bg-good rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {badges.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {badges.map((b) => (
            <span key={b} className="text-[10.5px] rounded-full bg-accent-tint text-accent-ink px-2.5 py-1 font-medium">
              {b}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
