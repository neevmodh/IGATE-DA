"use client";

import { useEffect, useMemo, useState } from "react";
import syllabus from "@/data/syllabus.json";

interface TopicProgress {
  done: boolean;
  note: string;
}

type ProgressMap = Record<string, TopicProgress>;

const STORAGE_KEY = "igate_syllabus_progress";

function keyFor(section: string, topic: string) {
  return `${section}::${topic}`;
}

export default function SyllabusTracker() {
  const [progress, setProgress] = useState<ProgressMap>({});
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setProgress(JSON.parse(raw));
    const initialOpen: Record<string, boolean> = {};
    syllabus.forEach((s, i) => (initialOpen[s.section] = i === 0));
    setOpenSections(initialOpen);
  }, []);

  function persist(next: ProgressMap) {
    setProgress(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function toggleDone(section: string, topic: string) {
    const k = keyFor(section, topic);
    const existing = progress[k] ?? { done: false, note: "" };
    persist({ ...progress, [k]: { ...existing, done: !existing.done } });
  }

  function saveNote(section: string, topic: string, note: string) {
    const k = keyFor(section, topic);
    const existing = progress[k] ?? { done: false, note: "" };
    persist({ ...progress, [k]: { ...existing, note } });
  }

  const totals = useMemo(() => {
    let total = 0,
      done = 0;
    syllabus.forEach((s) =>
      s.topics.forEach((t) => {
        total++;
        if (progress[keyFor(s.section, t)]?.done) done++;
      })
    );
    return { total, done };
  }, [progress]);

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Syllabus Progress</h2>
        <span className="text-sm text-zinc-500">
          {totals.done} / {totals.total} topics done (
          {totals.total ? Math.round((totals.done / totals.total) * 100) : 0}%)
        </span>
      </div>

      <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 mb-6 overflow-hidden">
        <div
          className="h-full bg-green-600 transition-all"
          style={{ width: `${totals.total ? (totals.done / totals.total) * 100 : 0}%` }}
        />
      </div>

      <div className="space-y-3">
        {syllabus.map((s) => {
          const sectionDone = s.topics.filter((t) => progress[keyFor(s.section, t)]?.done).length;
          const isOpen = openSections[s.section];
          return (
            <div key={s.section} className="rounded-md border border-zinc-200 dark:border-zinc-800">
              <button
                onClick={() => setOpenSections((prev) => ({ ...prev, [s.section]: !prev[s.section] }))}
                className="w-full flex justify-between items-center px-3 py-2 text-left text-sm font-medium"
              >
                <span>{s.section}</span>
                <span className="text-zinc-500 text-xs">
                  {sectionDone}/{s.topics.length} {isOpen ? "▲" : "▼"}
                </span>
              </button>

              {isOpen && (
                <div className="px-3 pb-3 space-y-2">
                  {s.topics.map((t) => {
                    const k = keyFor(s.section, t);
                    const p = progress[k] ?? { done: false, note: "" };
                    const draft = noteDrafts[k] ?? p.note;
                    return (
                      <div key={t} className="rounded-md bg-zinc-50 dark:bg-zinc-900 p-2">
                        <label className="flex items-start gap-2 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={p.done}
                            onChange={() => toggleDone(s.section, t)}
                            className="mt-1"
                          />
                          <span className={p.done ? "line-through text-zinc-500" : ""}>{t}</span>
                        </label>
                        <textarea
                          value={draft}
                          onChange={(e) =>
                            setNoteDrafts((prev) => ({ ...prev, [k]: e.target.value }))
                          }
                          onBlur={(e) => saveNote(s.section, t, e.target.value)}
                          placeholder="Notes (formulas, doubts, links)…"
                          rows={draft ? undefined : 1}
                          className="w-full mt-1 text-xs rounded border border-zinc-200 dark:border-zinc-800 bg-transparent px-2 py-1 resize-y"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
