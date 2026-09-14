"use client";

import questions from "@/data/questions.json";
import { Question } from "@/lib/types";
import MotivationBar from "@/components/MotivationBar";

const allQuestions = questions as Question[];

const navCards = [
  { href: "/practice", icon: "📝", title: "Practice", desc: "Topic-wise or full GATE mock" },
  { href: "/builder", icon: "🎛", title: "Custom Test", desc: "Pick sections, difficulty, count" },
  { href: "/test?mode=pyq&count=65", icon: "📄", title: "PYQ Only", desc: "Real past GATE DA questions" },
  { href: "/syllabus", icon: "✅", title: "Syllabus", desc: "Track topics done + notes" },
  { href: "/analyze", icon: "📊", title: "Analyze", desc: "Trends, heatmap, cutoff, scores" },
  { href: "/mistakes", icon: "❌", title: "Mistakes", desc: "Auto-collected wrong answers" },
  { href: "/browse", icon: "🔍", title: "Browse", desc: "Search the question bank" },
  { href: "/bookmarks", icon: "★", title: "Bookmarks", desc: "Saved questions" },
  { href: "/cheatsheets", icon: "📋", title: "Cheat Sheets", desc: "Quick formulas per section" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50">
      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-1">I-GATE</h1>
        <p className="text-zinc-500 mb-6">GATE DA 2027 practice — Data Science &amp; Artificial Intelligence</p>

        <MotivationBar />

        <a
          href="/test?mode=daily"
          className="block w-full rounded-lg bg-orange-500 text-white text-center py-3.5 font-medium mb-8"
        >
          ⚡ Today&apos;s Daily Quiz (10 Qs)
        </a>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {navCards.map((c) => (
            <a
              key={c.href}
              href={c.href}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <div className="text-xl mb-1">{c.icon}</div>
              <div className="text-sm font-medium">{c.title}</div>
              <div className="text-[11px] text-zinc-500">{c.desc}</div>
            </a>
          ))}
        </div>

        <div className="flex justify-between text-xs text-zinc-500 border-t border-zinc-200 dark:border-zinc-800 pt-4">
          <span>{allQuestions.length} questions in bank</span>
          <a href="/admin" className="text-blue-600 hover:underline">
            + Add questions
          </a>
        </div>
      </main>
    </div>
  );
}
