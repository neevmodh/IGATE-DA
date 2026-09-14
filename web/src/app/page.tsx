"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import questions from "@/data/questions.json";
import { Question } from "@/lib/types";
import SyllabusTracker from "@/components/SyllabusTracker";
import MotivationBar from "@/components/MotivationBar";

const allQuestions = questions as Question[];

export default function Home() {
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
      <main className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-1">I-GATE</h1>
        <p className="text-zinc-500 mb-6">GATE DA 2027 practice — Data Science &amp; Artificial Intelligence</p>

        <MotivationBar />

        <div className="grid grid-cols-3 gap-2 mb-6 text-xs">
          <a href="/builder" className="rounded-md border border-zinc-300 dark:border-zinc-700 text-center py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900">
            🎛 Custom test
          </a>
          <a href="/browse" className="rounded-md border border-zinc-300 dark:border-zinc-700 text-center py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900">
            🔍 Browse Qs
          </a>
          <a href="/test?mode=pyq&count=65" className="rounded-md border border-zinc-300 dark:border-zinc-700 text-center py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900">
            📄 PYQ only
          </a>
          <a href="/mistakes" className="rounded-md border border-zinc-300 dark:border-zinc-700 text-center py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900">
            ❌ Mistakes
          </a>
          <a href="/bookmarks" className="rounded-md border border-zinc-300 dark:border-zinc-700 text-center py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900">
            ★ Bookmarks
          </a>
          <a href="/cheatsheets" className="rounded-md border border-zinc-300 dark:border-zinc-700 text-center py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900">
            📋 Cheat sheets
          </a>
        </div>

        <a
          href="/test?mode=daily"
          className="block w-full rounded-lg bg-orange-500 text-white text-center py-3 font-medium mb-6"
        >
          ⚡ Today&apos;s Daily Quiz (10 Qs)
        </a>

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
              marking, 3-hour timer. Question bank is currently small — mock will reuse questions as needed
              until more are added.
            </div>
          )}

          <button
            onClick={startTest}
            disabled={allQuestions.length === 0}
            className="w-full rounded-lg bg-blue-600 text-white py-3 font-medium disabled:opacity-40"
          >
            Start Test
          </button>

          <div className="flex justify-between text-sm pt-4">
            <a href="/history" className="text-blue-600 hover:underline">
              View score history →
            </a>
            <a href="/admin" className="text-zinc-500 hover:underline">
              {allQuestions.length} questions in bank · add more →
            </a>
          </div>

          <SyllabusTracker />
        </div>
      </main>
    </div>
  );
}
