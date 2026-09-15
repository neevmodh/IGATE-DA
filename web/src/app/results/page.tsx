"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Question } from "@/lib/types";
import { scoreQuestion, UserAnswer } from "@/lib/scoring";

interface ResultData {
  testQuestions: Question[];
  answers: Record<string, UserAnswer>;
  attempt: {
    marks_scored: number;
    max_marks: number;
    correct: number;
    incorrect: number;
    unattempted: number;
    accuracy_pct: number;
    weak_topics: string;
  };
}

export default function Results() {
  const [data, setData] = useState<ResultData | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("igate_last_result");
    if (raw) setData(JSON.parse(raw));
  }, []);

  if (!data) {
    return (
      <div className="p-10">
        No recent result found. <Link href="/" className="text-accent underline">Go home</Link>
      </div>
    );
  }

  const { testQuestions, answers, attempt } = data;

  return (
    <div className="min-h-screen bg-bg text-ink">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex items-center gap-2.5 mb-6">
          <Image src="/gate-logo.svg" alt="" width={26} height={24} />
          <h1 className="text-2xl font-bold">Results</h1>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <Stat label="Score" value={`${attempt.marks_scored} / ${attempt.max_marks}`} />
          <Stat label="Accuracy" value={`${attempt.accuracy_pct}%`} />
          <Stat label="Correct" value={String(attempt.correct)} />
          <Stat label="Incorrect" value={String(attempt.incorrect)} />
        </div>

        {attempt.weak_topics && (
          <div className="mb-8 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950 dark:border-amber-800 p-4 text-sm">
            <strong>Weak topics this test:</strong> {attempt.weak_topics}
          </div>
        )}

        <h2 className="text-lg font-semibold mb-3">Review</h2>
        <div className="space-y-4">
          {testQuestions.map((q) => {
            const ans = answers[q.id] ?? null;
            const result = scoreQuestion(q, ans);
            return (
              <div
                key={q.id}
                className={`rounded-lg border p-4 text-sm ${
                  result.isCorrect
                    ? "border-green-300 bg-green-50 dark:bg-green-950 dark:border-green-800"
                    : "border-red-300 bg-red-50 dark:bg-red-950 dark:border-red-800"
                }`}
              >
                <div className="text-xs text-ink-3 mb-1">
                  {q.section} — {q.topic}
                </div>
                <p className="mb-2 whitespace-pre-wrap">{q.question}</p>
                <p className="text-xs mb-1">
                  Your answer:{" "}
                  {ans === null || (Array.isArray(ans) && ans.length === 0)
                    ? "Not attempted"
                    : Array.isArray(ans)
                    ? ans.join(", ")
                    : ans}
                </p>
                <p className="text-xs mb-2">
                  Correct answer: {q.correct_answer.join(", ")} ({result.marks >= 0 ? "+" : ""}
                  {result.marks} marks)
                </p>
                <p className="text-xs text-ink-2">{q.explanation}</p>
              </div>
            );
          })}
        </div>

        <div className="flex gap-4 mt-8">
          <Link href="/" className="rounded-md bg-accent text-white px-4 py-2 text-sm">
            New test
          </Link>
          <Link href="/analyze" className="rounded-md border border-border shadow-sm px-4 py-2 text-sm">
            Analyze
          </Link>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border shadow-sm p-4">
      <div className="text-xs text-ink-3">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}
