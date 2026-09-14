"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import questions from "@/data/questions.json";
import { Question } from "@/lib/types";
import { scoreQuestion, UserAnswer } from "@/lib/scoring";
import Calculator from "@/components/Calculator";
import { isDue } from "@/lib/srs";

const allQuestions = questions as Question[];
const AUTOSAVE_KEY = "igate_inprogress_test";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type QStatus = "not-visited" | "not-answered" | "answered" | "marked" | "answered-marked";

function TestInner() {
  const router = useRouter();
  const params = useSearchParams();
  const mode = params.get("mode") ?? "topic";
  const section = params.get("section") ?? "";
  const count = Number(params.get("count") ?? 10);

  const testQuestions = useMemo(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(AUTOSAVE_KEY) : null;
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.mode === mode && parsed.section === section && parsed.count === count) {
        return parsed.testQuestions as Question[];
      }
    }
    if (mode === "full") return shuffle(allQuestions).slice(0, Math.min(65, allQuestions.length));
    if (mode === "review") {
      const raw = localStorage.getItem("igate_mistakes");
      const mistakes = raw ? JSON.parse(raw) : {};
      const due = Object.values(mistakes as Record<string, { question: Question; lastMissedAt: string; timesMissed: number }>)
        .filter((m) => isDue(m.lastMissedAt, m.timesMissed))
        .map((m) => m.question);
      return shuffle(due);
    }
    if (mode === "custom") {
      const raw = sessionStorage.getItem("igate_custom_spec");
      if (!raw) return [];
      const spec = JSON.parse(raw) as { sections: string[]; difficulties: string[]; count: number };
      const pool = allQuestions.filter(
        (q) => (spec.sections.length === 0 || spec.sections.includes(q.section)) && spec.difficulties.includes(q.difficulty)
      );
      return shuffle(pool).slice(0, spec.count);
    }
    if (mode === "daily") {
      const raw = localStorage.getItem("igate_mistakes");
      const mistakes = raw ? JSON.parse(raw) : {};
      const dueMistakes = Object.values(mistakes as Record<string, { question: Question; lastMissedAt: string; timesMissed: number }>)
        .filter((m) => isDue(m.lastMissedAt, m.timesMissed))
        .map((m) => m.question);
      const rest = shuffle(allQuestions.filter((q) => !dueMistakes.some((d) => d.id === q.id)));
      return shuffle([...dueMistakes, ...rest].slice(0, 10));
    }
    if (mode === "pyq") {
      const pool = allQuestions.filter((q) => q.source !== "generated");
      return shuffle(pool).slice(0, Math.min(count || 65, pool.length));
    }
    const pool = allQuestions.filter((q) => q.section === section);
    return shuffle(pool).slice(0, count);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const savedState = useMemo(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(AUTOSAVE_KEY) : null;
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    if (parsed.mode === mode && parsed.section === section && parsed.count === count) return parsed;
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const durationSec = mode === "full" ? 3 * 3600 : testQuestions.length * 90;
  const [secondsLeft, setSecondsLeft] = useState(savedState?.secondsLeft ?? durationSec);
  const [current, setCurrent] = useState(savedState?.current ?? 0);
  const [answers, setAnswers] = useState<Record<string, UserAnswer>>(savedState?.answers ?? {});
  const [visited, setVisited] = useState<Record<string, boolean>>(savedState?.visited ?? {});
  const [marked, setMarked] = useState<Record<string, boolean>>(savedState?.marked ?? {});
  const [timeSpent, setTimeSpent] = useState<Record<string, number>>(savedState?.timeSpent ?? {});
  const [showCalc, setShowCalc] = useState(false);
  const questionStartRef = useRef<number>(Date.now());

  const q = testQuestions[current];

  useEffect(() => {
    if (!q) return;
    setVisited((prev) => (prev[q.id] ? prev : { ...prev, [q.id]: true }));
    questionStartRef.current = Date.now();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, q?.id]);

  function recordTimeOnCurrent() {
    if (!q) return;
    const elapsed = (Date.now() - questionStartRef.current) / 1000;
    setTimeSpent((prev) => ({ ...prev, [q.id]: (prev[q.id] ?? 0) + elapsed }));
    questionStartRef.current = Date.now();
  }

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s: number) => s - 1), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  useEffect(() => {
    if (secondsLeft === 0) handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  useEffect(() => {
    if (testQuestions.length === 0) return;
    localStorage.setItem(
      AUTOSAVE_KEY,
      JSON.stringify({ mode, section, count, testQuestions, current, answers, visited, marked, timeSpent, secondsLeft })
    );
  }, [mode, section, count, testQuestions, current, answers, visited, marked, timeSpent, secondsLeft]);

  if (testQuestions.length === 0) {
    return <div className="p-10">No questions available for this selection.</div>;
  }

  function setAnswer(val: UserAnswer) {
    setAnswers((prev) => ({ ...prev, [q.id]: val }));
  }

  function toggleMSQ(opt: string) {
    const existing = (answers[q.id] as string[]) ?? [];
    const next = existing.includes(opt) ? existing.filter((o) => o !== opt) : [...existing, opt];
    setAnswer(next);
  }

  function goTo(idx: number) {
    recordTimeOnCurrent();
    setCurrent(idx);
  }

  function toggleMark() {
    setMarked((prev) => ({ ...prev, [q.id]: !prev[q.id] }));
  }

  function statusOf(qq: Question): QStatus {
    const isAnswered =
      answers[qq.id] !== undefined &&
      answers[qq.id] !== null &&
      !(Array.isArray(answers[qq.id]) && (answers[qq.id] as string[]).length === 0);
    const isMarked = !!marked[qq.id];
    if (isMarked && isAnswered) return "answered-marked";
    if (isMarked) return "marked";
    if (isAnswered) return "answered";
    if (visited[qq.id]) return "not-answered";
    return "not-visited";
  }

  const statusColor: Record<QStatus, string> = {
    "not-visited": "bg-zinc-300 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300",
    "not-answered": "bg-red-500 text-white",
    answered: "bg-green-600 text-white",
    marked: "bg-purple-600 text-white",
    "answered-marked": "bg-purple-600 text-white ring-2 ring-green-400",
  };

  function handleSubmit() {
    recordTimeOnCurrent();
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
      scope: mode === "topic" ? section : mode,
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

    const mistakes = JSON.parse(localStorage.getItem("igate_mistakes") || "{}");
    testQuestions.forEach((tq) => {
      const ans = answers[tq.id] ?? null;
      const result = scoreQuestion(tq, ans);
      if (result.attempted && !result.isCorrect) {
        mistakes[tq.id] = { question: tq, lastMissedAt: new Date().toISOString(), timesMissed: (mistakes[tq.id]?.timesMissed ?? 0) + 1 };
      }
    });
    localStorage.setItem("igate_mistakes", JSON.stringify(mistakes));

    sessionStorage.setItem(
      "igate_last_result",
      JSON.stringify({ testQuestions, answers, attempt, timeSpent })
    );
    localStorage.removeItem(AUTOSAVE_KEY);
    router.push("/results");
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50">
      <div className="max-w-5xl mx-auto px-4 py-6 flex gap-6">
        <div className="flex-1 max-w-2xl">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-zinc-500">
              Question {current + 1} / {testQuestions.length}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCalc((v) => !v)}
                className="text-xs rounded border border-zinc-300 dark:border-zinc-700 px-2 py-1"
              >
                🧮 Calculator
              </button>
              <span className="font-mono text-lg">
                {mm}:{ss}
              </span>
            </div>
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
              onClick={() => goTo(current - 1)}
              className="rounded-md border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={toggleMark}
              className={`rounded-md border px-4 py-2 text-sm ${
                marked[q.id]
                  ? "border-purple-600 bg-purple-600 text-white"
                  : "border-zinc-300 dark:border-zinc-700"
              }`}
            >
              {marked[q.id] ? "Unmark Review" : "Mark for Review"}
            </button>
            {current < testQuestions.length - 1 ? (
              <button
                onClick={() => goTo(current + 1)}
                className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm"
              >
                Save & Next
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

        <aside className="w-56 shrink-0 hidden md:block">
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 sticky top-6">
            <div className="text-sm font-medium mb-2">Question Palette</div>
            <div className="grid grid-cols-5 gap-1 mb-3">
              {testQuestions.map((tq, i) => (
                <button
                  key={tq.id}
                  onClick={() => goTo(i)}
                  className={`rounded text-xs h-7 w-7 flex items-center justify-center ${statusColor[statusOf(tq)]} ${
                    i === current ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="space-y-1 text-[11px] text-zinc-600 dark:text-zinc-400">
              <Legend color="bg-zinc-300 dark:bg-zinc-700" label="Not visited" />
              <Legend color="bg-red-500" label="Not answered" />
              <Legend color="bg-green-600" label="Answered" />
              <Legend color="bg-purple-600" label="Marked for review" />
            </div>
            <button
              onClick={handleSubmit}
              className="w-full mt-4 rounded-md bg-green-600 text-white py-2 text-sm"
            >
              Submit Test
            </button>
          </div>
        </aside>
      </div>

      {showCalc && <Calculator onClose={() => setShowCalc(false)} />}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block h-3 w-3 rounded ${color}`} />
      {label}
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
