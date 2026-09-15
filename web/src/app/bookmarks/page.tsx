"use client";

import Image from "next/image";

import { useEffect, useState } from "react";
import Link from "next/link";
import questions from "@/data/questions.json";
import { Question } from "@/lib/types";

const allQuestions = questions as Question[];

export default function Bookmarks() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("igate_bookmarks");
    if (raw) setIds(JSON.parse(raw));
  }, []);

  function remove(id: string) {
    const next = ids.filter((i) => i !== id);
    setIds(next);
    localStorage.setItem("igate_bookmarks", JSON.stringify(next));
  }

  const bookmarked = allQuestions.filter((q) => ids.includes(q.id));

  return (
    <div className="min-h-screen bg-bg text-ink">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2.5"><Image src="/gate-logo.svg" alt="" width={22} height={20} /><h1 className="text-2xl font-bold">Bookmarks</h1></div>
          <Link href="/" className="text-accent hover:underline text-sm">
            ← Home
          </Link>
        </div>

        {bookmarked.length === 0 ? (
          <p className="text-ink-3">
            No bookmarks yet. Bookmark a question from the question browser to save it here.
          </p>
        ) : (
          <div className="space-y-4">
            {bookmarked.map((q) => (
              <div key={q.id} className="rounded-lg border border-border shadow-sm p-4 text-sm">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs text-ink-3">
                    {q.section} — {q.topic}
                  </span>
                  <button onClick={() => remove(q.id)} className="text-xs text-ink-3 hover:underline">
                    Remove
                  </button>
                </div>
                <p className="mb-2 whitespace-pre-wrap">{q.question}</p>
                <p className="text-xs mb-1">Correct answer: {q.correct_answer.join(", ")}</p>
                <p className="text-xs text-ink-2">{q.explanation}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
