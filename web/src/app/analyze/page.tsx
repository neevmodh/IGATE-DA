"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Attempt } from "@/lib/types";
import cutoffs from "@/data/cutoffs.json";

export default function Analyze() {
  const [history, setHistory] = useState<Attempt[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("igate_history");
    if (raw) setHistory(JSON.parse(raw).reverse());
  }, []);

  function downloadCSV() {
    const headers = [
      "date","test_type","scope","total_questions","attempted","correct",
      "incorrect","unattempted","marks_scored","max_marks","accuracy_pct","weak_topics",
    ];
    const rows = [...history].reverse().map((h) => headers.map((k) => (h as unknown as Record<string, unknown>)[k]).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "igate_history.csv";
    a.click();
  }

  const topicStats: Record<string, { total: number; misses: number }> = {};
  history.forEach((h) => {
    h.weak_topics
      .split(";")
      .map((t) => t.trim())
      .filter(Boolean)
      .forEach((t) => {
        topicStats[t] = topicStats[t] || { total: 0, misses: 0 };
        topicStats[t].misses++;
        topicStats[t].total++;
      });
  });
  const heatmapTopics = Object.entries(topicStats).sort((a, b) => b[1].misses - a[1].misses).slice(0, 12);

  const chronological = [...history].reverse();
  const trendPoints = chronological.map((h) => h.accuracy_pct);
  const latestFullMockPct = [...chronological].reverse().find((h) => h.scope === "full");
  const latestCutoff = cutoffs.byYear["2025" as keyof typeof cutoffs.byYear];

  const totalQuestions = history.reduce((s, h) => s + h.total_questions, 0);
  const totalCorrect = history.reduce((s, h) => s + h.correct, 0);
  const overallAccuracy = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 1000) / 10 : 0;
  const testsTaken = history.length;

  return (
    <div className="min-h-screen bg-bg text-ink">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Analyze</h1>
          <Link href="/" className="text-accent hover:underline text-sm">
            ← Home
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard label="Tests taken" value={String(testsTaken)} />
          <StatCard label="Questions solved" value={String(totalQuestions)} />
          <StatCard label="Overall accuracy" value={`${overallAccuracy}%`} />
        </div>

        {latestFullMockPct && (
          <div className="mb-6 rounded-lg border border-accent-tint bg-accent-tint p-4 text-sm">
            <strong>Latest full mock:</strong> {latestFullMockPct.marks_scored} / {latestFullMockPct.max_marks} marks.
            Rough GATE DA qualifying cutoff (General, {Object.keys(cutoffs.byYear).slice(-1)[0]}) is ~{latestCutoff} —{" "}
            {latestFullMockPct.marks_scored >= latestCutoff ? "you'd be above it. " : "you'd be below it. "}
            <span className="text-ink-3">({cutoffs.note})</span>
          </div>
        )}

        {trendPoints.length > 1 && (
          <div className="mb-6 rounded-lg border border-border p-4">
            <div className="text-sm font-medium mb-2">Accuracy trend</div>
            <TrendChart points={trendPoints} />
          </div>
        )}

        {heatmapTopics.length > 0 && (
          <div className="mb-8 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950 dark:border-amber-800 p-4 text-sm">
            <div className="font-medium mb-2">Weak-topic heatmap (darker = more misses)</div>
            <div className="flex flex-wrap gap-2">
              {heatmapTopics.map(([t, s]) => {
                const intensity = Math.min(s.misses / 5, 1);
                return (
                  <span
                    key={t}
                    style={{ backgroundColor: `rgba(220, 38, 38, ${0.15 + intensity * 0.6})` }}
                    className="rounded px-2 py-1 text-xs text-ink"
                  >
                    {t} ({s.misses}x)
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {history.length === 0 ? (
          <p className="text-ink-3">No tests taken yet.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="py-2 pr-3">Date</th>
                    <th className="py-2 pr-3">Scope</th>
                    <th className="py-2 pr-3">Score</th>
                    <th className="py-2 pr-3">Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr key={i} className="border-b border-border">
                      <td className="py-2 pr-3">{new Date(h.date).toLocaleString()}</td>
                      <td className="py-2 pr-3">{h.scope}</td>
                      <td className="py-2 pr-3">
                        {h.marks_scored} / {h.max_marks}
                      </td>
                      <td className="py-2 pr-3">{h.accuracy_pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={downloadCSV}
                className="rounded-md border border-border px-4 py-2 text-sm"
              >
                Export CSV (for scores/history.csv in repo)
              </button>
              <Link href="/mistakes" className="rounded-md border border-border px-4 py-2 text-sm">
                Mistake Notebook →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-3 text-center">
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-[11px] text-ink-3">{label}</div>
    </div>
  );
}

function TrendChart({ points }: { points: number[] }) {
  const w = 500;
  const h = 120;
  const max = 100;
  const stepX = points.length > 1 ? w / (points.length - 1) : 0;
  const coords = points.map((p, i) => `${i * stepX},${h - (p / max) * h}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-28" preserveAspectRatio="none">
      <polyline points={coords} fill="none" stroke="currentColor" className="text-accent" strokeWidth={2} />
      {points.map((p, i) => (
        <circle key={i} cx={i * stepX} cy={h - (p / max) * h} r={3} className="fill-accent" />
      ))}
    </svg>
  );
}
