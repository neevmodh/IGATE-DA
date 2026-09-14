"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Attempt } from "@/lib/types";

export default function History() {
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

  const topicMisses: Record<string, number> = {};
  history.forEach((h) => {
    h.weak_topics
      .split(";")
      .map((t) => t.trim())
      .filter(Boolean)
      .forEach((t) => (topicMisses[t] = (topicMisses[t] || 0) + 1));
  });
  const weakest = Object.entries(topicMisses).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Score History</h1>
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            ← New test
          </Link>
        </div>

        {weakest.length > 0 && (
          <div className="mb-8 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950 dark:border-amber-800 p-4 text-sm">
            <strong>Recurring weak topics:</strong>{" "}
            {weakest.map(([t, n]) => `${t} (${n}x)`).join(", ")}
          </div>
        )}

        {history.length === 0 ? (
          <p className="text-zinc-500">No tests taken yet.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left border-b border-zinc-300 dark:border-zinc-700">
                    <th className="py-2 pr-3">Date</th>
                    <th className="py-2 pr-3">Scope</th>
                    <th className="py-2 pr-3">Score</th>
                    <th className="py-2 pr-3">Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr key={i} className="border-b border-zinc-200 dark:border-zinc-800">
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
            <button
              onClick={downloadCSV}
              className="mt-6 rounded-md border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm"
            >
              Export CSV (for scores/history.csv in repo)
            </button>
          </>
        )}
      </div>
    </div>
  );
}
