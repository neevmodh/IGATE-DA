"use client";

import Image from "next/image";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import questions from "@/data/questions.json";
import { Question } from "@/lib/types";

const allQuestions = questions as Question[];

export default function Builder() {
  const router = useRouter();
  const sections = useMemo(() => Array.from(new Set(allQuestions.map((q) => q.section))).sort(), []);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [difficulties, setDifficulties] = useState<string[]>(["easy", "medium", "hard"]);
  const [count, setCount] = useState(20);

  function toggleSection(s: string) {
    setSelectedSections((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  function toggleDifficulty(d: string) {
    setDifficulties((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  }

  const matchCount = allQuestions.filter(
    (q) => (selectedSections.length === 0 || selectedSections.includes(q.section)) && difficulties.includes(q.difficulty)
  ).length;

  function start() {
    const spec = { sections: selectedSections, difficulties, count };
    sessionStorage.setItem("igate_custom_spec", JSON.stringify(spec));
    router.push("/test?mode=custom");
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2.5"><Image src="/gate-logo.svg" alt="" width={22} height={20} /><h1 className="text-2xl font-bold">Custom Test Builder</h1></div>
          <Link href="/" className="text-accent hover:underline text-sm">
            ← Home
          </Link>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Sections (none selected = all)</label>
            <div className="flex flex-wrap gap-2">
              {sections.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSection(s)}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    selectedSections.includes(s)
                      ? "border-accent bg-accent text-white"
                      : "border-border"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Difficulty</label>
            <div className="flex gap-2">
              {["easy", "medium", "hard"].map((d) => (
                <button
                  key={d}
                  onClick={() => toggleDifficulty(d)}
                  className={`rounded-full border px-3 py-1 text-xs capitalize ${
                    difficulties.includes(d)
                      ? "border-accent bg-accent text-white"
                      : "border-border"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Number of questions</label>
            <input
              type="number"
              min={1}
              max={Math.max(matchCount, 1)}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full rounded-md border border-border shadow-sm bg-transparent px-3 py-2"
            />
            <p className="text-xs text-ink-3 mt-1">{matchCount} questions match this filter</p>
          </div>

          <button
            onClick={start}
            disabled={matchCount === 0}
            className="w-full rounded-lg bg-accent text-white py-3 font-medium disabled:opacity-40"
          >
            Start Custom Test
          </button>
        </div>
      </div>
    </div>
  );
}
