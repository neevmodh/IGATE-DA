"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import questions from "@/data/questions.json";
import { Question } from "@/lib/types";
import { scoreQuestion, UserAnswer } from "@/lib/scoring";

const allQuestions = questions as Question[];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function TestInner() {
  const router = useRouter();
  const params = useSearchParams();
  const mode = params.get("mode") ?? "topic";
  const section = params.get("section") ?? "";
  const count = Number(params.get("count") ?? 10);

  const testQuestions = useMemo(() => {
    if (mode === "full") return shuffle(allQuestions).slice(0, Math.min(65, allQuestions.length));
    const pool = allQuestions.filter((q) => q.section === section);
    return shuffle(pool).slice(0, count);
  }, [mode, section, count]);

  const durationSec = mode === "full" ? 3 * 3600 : testQuestions.length * 90;
  const [secondsLeft, setSecondsLeft] = useState(durationSec);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, UserAnswer>>({});

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  useEffect(() => {
    if (secondsLeft === 0) handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  if (testQuestions.length === 0) {
    return <div className="p-10">No questions available for this selection.</div>;
  }

  const q = testQuestions[current];

  function setAnswer(val: UserAnswer) {
    setAnswers((prev) => ({ ...prev, [q.id]: val }));
  }

  function toggleMSQ(opt: string) {
    const existing = (answers[q.id] as string[]) ?? [];
    const next = existing.includes(opt) ? existing.filter((o) => o !== opt) : [...existing, opt];
    setAnswer(next);
  }

  function handleSubmit() {
    let marks = 0,
      correct = 0,
      incorrect = 0,
      attempted = 0;
    const weakTopics: Record<string, { total: number; correct: number }> = {};

    testQuestions.forEach((tq) => {
      const ans = answers[tq.id] ?? null;
      const result = scoreQuestion(tq, ans);
      marks += result.marks;
      if (result.attempted) attempted++;
      if (result.attempted && result.isCorrect) correct++;
      if (result.attempted && !result.isCorrect) incorrect++;

      weakTopics[tq.topic] = weakTopics[tq.topic] || { total: 0, correct: 0 };
      weakTopics[tq.topic].total++;
      if (result.isCorrect) weakTopics[tq.topic].correct++;
    });

    const maxMarks = testQuestions.reduce((s, tq) => s + tq.marks, 0);
    const weak = Object.entries(weakTopics)
      .filter(([, v]) => v.correct / v.total < 0.5)
      .map(([k]) => k);

    const attempt = {
      date: new Date().toISOString(),
      test_type: mode,
      scope: mode === "full" ? "full" : section,
      total_questions: testQuestions.length,
      attempted,
      correct,
      incorrect,
      unattempted: testQuestions.length - attempted,
      marks_scored: Math.round(marks * 100) / 100,
      max_marks: maxMarks,
      accuracy_pct: attempted ? Math.round((correct / attempted) * 10000) / 100 : 0,
      weak_topics: weak.join("; "),
    };

    const history = JSON.parse(localStorage.getItem("igate_history") || "[]");
    history.push(attempt);
    localStorage.setItem("igate_history", JSON.stringify(history));
    sessionStorage.setItem(
      "igate_last_result",
      JSON.stringify({ testQuestions, answers, attempt })
    );
    router.push("/results");
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm text-zinc-500">
            Question {current + 1} / {testQuestions.length}
          </span>
          <span className="font-mono text-lg">
            {mm}:{ss}
          </span>
        </div>

        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="text-xs text-zinc-500 mb-2">
            {q.section} — {q.topic} · {q.type} · {q.marks} mark{q.marks > 1 ? "s" : ""}
          </div>
          <p className="mb-4 whitespace-pre-wrap">{q.question}</p>

          {q.type === "MCQ" &&
            q.options.map((opt) => {
              const letter = opt[0];
              const selected = (answers[q.id] as string[])?.[0] === letter;
              return (
                <label
                  key={opt}
                  className={`block cursor-pointer rounded-md border px-3 py-2 mb-2 text-sm ${
                    selected
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                      : "border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  <input
                    type="radio"
                    name={q.id}
                    className="mr-2"
                    checked={selected}
                    onChange={() => setAnswer([letter])}
                  />
                  {opt}
                </label>
              );
            })}

          {q.type === "MSQ" &&
            q.options.map((opt) => {
              const letter = opt[0];
              const selected = ((answers[q.id] as string[]) ?? []).includes(letter);
              return (
                <label
                  key={opt}
                  className={`block cursor-pointer rounded-md border px-3 py-2 mb-2 text-sm ${
                    selected
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                      : "border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selected}
                    onChange={() => toggleMSQ(letter)}
                  />
                  {opt}
                </label>
              );
            })}

          {q.type === "NAT" && (
            <input
              type="number"
              step="any"
              value={(answers[q.id] as number) ?? ""}
              onChange={(e) => setAnswer(e.target.value === "" ? null : Number(e.target.value))}
              placeholder="Enter numeric answer"
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
            />
          )}
        </div>

        <div className="flex justify-between mt-6">
          <button
            disabled={current === 0}
            onClick={() => setCurrent((c) => c - 1)}
            className="rounded-md border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          {current < testQuestions.length - 1 ? (
            <button
              onClick={() => setCurrent((c) => c + 1)}
              className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="rounded-md bg-green-600 text-white px-4 py-2 text-sm"
            >
              Submit Test
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TestPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading…</div>}>
      <TestInner />
    </Suspense>
  );
}
