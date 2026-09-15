"use client";

import Image from "next/image";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import questions from "@/data/questions.json";
import { Question } from "@/lib/types";

const allQuestions = questions as Question[];

export default function Browse() {
  const [query, setQuery] = useState("");
  const [section, setSection] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [sourceFilter, setSourceFilter] = useState<"All" | "PYQ" | "Generated">("All");
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("igate_bookmarks");
    if (raw) setBookmarks(JSON.parse(raw));
  }, []);

  function toggleBookmark(id: string) {
    const next = bookmarks.includes(id) ? bookmarks.filter((b) => b !== id) : [...bookmarks, id];
    setBookmarks(next);
    localStorage.setItem("igate_bookmarks", JSON.stringify(next));
  }

  const sections = useMemo(() => ["All", ...Array.from(new Set(allQuestions.map((q) => q.section))).sort()], []);

  const filtered = allQuestions.filter((q) => {
    if (section !== "All" && q.section !== section) return false;
    if (difficulty !== "All" && q.difficulty !== difficulty) return false;
    if (sourceFilter === "PYQ" && q.source === "generated") return false;
    if (sourceFilter === "Generated" && q.source !== "generated") return false;
    if (query && !q.question.toLowerCase().includes(query.toLowerCase()) && !q.tags.some((t) => t.includes(query.toLowerCase())))
      return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-bg text-ink">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2.5"><Image src="/gate-logo.svg" alt="" width={22} height={20} /><h1 className="text-2xl font-bold">Browse Questions</h1></div>
          <Link href="/" className="text-accent hover:underline text-sm">
            ← Home
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search question text or tag…"
            className="col-span-2 rounded-md border border-border shadow-sm bg-transparent px-3 py-2 text-sm"
          />
          <select value={section} onChange={(e) => setSection(e.target.value)} className="rounded-md border border-border shadow-sm bg-transparent px-3 py-2 text-sm">
            {sections.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="rounded-md border border-border shadow-sm bg-transparent px-3 py-2 text-sm">
            {["All", "easy", "medium", "hard"].map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value as "All" | "PYQ" | "Generated")}
            className="col-span-2 rounded-md border border-border shadow-sm bg-transparent px-3 py-2 text-sm"
          >
            <option value="All">All sources</option>
            <option value="PYQ">Past year questions only</option>
            <option value="Generated">AI-generated only</option>
          </select>
        </div>

        <p className="text-xs text-ink-3 mb-4">{filtered.length} questions</p>

        <div className="space-y-3">
          {filtered.map((q) => (
            <div key={q.id} className="rounded-lg border border-border shadow-sm p-4 text-sm">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs text-ink-3">
                  {q.section} — {q.topic} · {q.difficulty} · {q.source}
                </span>
                <button onClick={() => toggleBookmark(q.id)} className="text-xs">
                  {bookmarks.includes(q.id) ? "★ Bookmarked" : "☆ Bookmark"}
                </button>
              </div>
              <p className="whitespace-pre-wrap">{q.question}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
