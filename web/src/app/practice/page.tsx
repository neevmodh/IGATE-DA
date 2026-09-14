"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import questions from "@/data/questions.json";
import { Question } from "@/lib/types";

const allQuestions = questions as Question[];

export default function Practice() {
  const router = useRouter();
  const sections = useMemo(
    () => Array.from(new Set(allQuestions.map((q) => q.section))).sort(),
    []
  );
  const [mode, setMode] = useState<"topic" | "full">("topic");
  const [section, setSection] = useState(sections[0] ?? "");
  const [count, setCount] = useState(10);

  const availableInSection = allQuestions.filter((q) => q.section === section).length;

  function startTest() {
    if (mode === "full") {
      router.push(`/test?mode=full`);
    } else {
      router.push(`/test?mode=topic&section=${encodeURIComponent(section)}&count=${count}`);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50">
      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Practice</h1>
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            ← Home
          </Link>
        </div>

        <div className="space-y-6">
          <div className="flex gap-3">
            <button
              onClick={() => setMode("topic")}
              className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium ${
                mode === "topic"
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-zinc-300 dark:border-zinc-700"
              }`}
            >
              Topic-wise practice
            </button>
            <button
              onClick={() => setMode("full")}
              className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium ${
                mode === "full"
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-zinc-300 dark:border-zinc-700"
              }`}
            >
              Full GATE mock (65 Q, 3 hrs)
            </button>
          </div>

          {mode === "topic" && (
            <div className="space-y-4 rounded-lg border border-zinc-200 dark:border-zinc-800 p-5">
              <div>
                <label className="block text-sm font-medium mb-1">Section</label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
                >
                  {sections.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-zinc-500 mt-1">{availableInSection} questions available</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Number of questions</label>
                <input
                  type="number"
                  min={1}
                  max={Math.max(availableInSection, 1)}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
                />
              </div>
            </div>
          )}

          {mode === "full" && (
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-5 text-sm text-zinc-600 dark:text-zinc-400">
              Full mock uses the official GATE DA pattern: 65 questions, 100 marks, MCQ/MSQ/NAT, negative
              marking, 3-hour timer, question palette, and mark-for-review — same as the real exam.
            </div>
          )}

          <button
            onClick={startTest}
            disabled={allQuestions.length === 0}
            className="w-full rounded-lg bg-blue-600 text-white py-3 font-medium disabled:opacity-40"
          >
            Start Test
          </button>

          <p className="text-xs text-zinc-500 text-center">
            Want more control? Try the{" "}
            <Link href="/builder" className="text-blue-600 hover:underline">
              Custom Test Builder
            </Link>{" "}
            or{" "}
            <Link href="/test?mode=pyq&count=65" className="text-blue-600 hover:underline">
              PYQ-only practice
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
