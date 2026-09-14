"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Question } from "@/lib/types";
import { isDue, nextDueDate } from "@/lib/srs";

interface MistakeEntry {
  question: Question;
  lastMissedAt: string;
  timesMissed: number;
}

export default function Mistakes() {
  const router = useRouter();
  const [mistakes, setMistakes] = useState<Record<string, MistakeEntry>>({});

  useEffect(() => {
    const raw = localStorage.getItem("igate_mistakes");
    if (raw) setMistakes(JSON.parse(raw));
  }, []);

  const entries = Object.entries(mistakes).sort((a, b) => b[1].timesMissed - a[1].timesMissed);
  const dueCount = entries.filter(([, m]) => isDue(m.lastMissedAt, m.timesMissed)).length;

  function clearMistake(id: string) {
    const next = { ...mistakes };
    delete next[id];
    setMistakes(next);
    localStorage.setItem("igate_mistakes", JSON.stringify(next));
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Mistake Notebook</h1>
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            ← Home
          </Link>
        </div>
        <p className="text-sm text-zinc-500 mb-4">
          Every question you've ever gotten wrong, auto-collected across all tests. Review these before your next mock.
        </p>

        {dueCount > 0 && (
          <button
            onClick={() => router.push("/test?mode=review")}
            className="w-full mb-6 rounded-lg bg-purple-600 text-white py-3 font-medium"
          >
            Start Review Session ({dueCount} due)
          </button>
        )}

        {entries.length === 0 ? (
          <p className="text-zinc-500">No mistakes logged yet — good sign, or you haven't taken a test yet.</p>
        ) : (
          <div className="space-y-4">
            {entries.map(([id, m]) => (
              <div key={id} className="rounded-lg border border-red-300 bg-red-50 dark:bg-red-950 dark:border-red-800 p-4 text-sm">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs text-zinc-500">
                    {m.question.section} — {m.question.topic} · missed {m.timesMissed}x ·{" "}
                    {isDue(m.lastMissedAt, m.timesMissed)
                      ? "due now"
                      : `due ${nextDueDate(m.lastMissedAt, m.timesMissed).toLocaleDateString()}`}
                  </span>
                  <button onClick={() => clearMistake(id)} className="text-xs text-zinc-500 hover:underline">
                    Mark resolved
                  </button>
                </div>
                <p className="mb-2 whitespace-pre-wrap">{m.question.question}</p>
                <p className="text-xs mb-1">Correct answer: {m.question.correct_answer.join(", ")}</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">{m.question.explanation}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
