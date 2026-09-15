"use client";

import Image from "next/image";

import { useState } from "react";
import Link from "next/link";
import { Question, QType } from "@/lib/types";

const sections = [
  "Probability and Statistics",
  "Linear Algebra",
  "Calculus and Optimization",
  "Programming, Data Structures & Algorithms",
  "Database Management & Warehousing",
  "Machine Learning",
  "Artificial Intelligence",
  "General Aptitude",
];

const blank: Question = {
  id: "",
  section: sections[0],
  topic: "",
  type: "MCQ",
  marks: 1,
  difficulty: "medium",
  question: "",
  options: ["A) ", "B) ", "C) ", "D) "],
  correct_answer: [],
  explanation: "",
  source: "generated",
  tags: [],
};

export default function Admin() {
  const [form, setForm] = useState<Question>(blank);
  const [draft, setDraft] = useState<Question[]>([]);

  function update<K extends keyof Question>(key: K, value: Question[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addToDraft() {
    if (!form.id || !form.question) return;
    setDraft((prev) => [...prev, form]);
    setForm({ ...blank, id: "" });
  }

  function downloadDraft() {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "new_questions.json";
    a.click();
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2.5"><Image src="/gate-logo.svg" alt="" width={22} height={20} /><h1 className="text-2xl font-bold">Question Editor</h1></div>
          <Link href="/" className="text-accent hover:underline text-sm">
            ← Home
          </Link>
        </div>
        <p className="text-xs text-ink-3 mb-6">
          Add questions here, then download the JSON and merge it into <code>question_bank/questions.json</code> in the repo (append to the array), commit, and push — Railway redeploys automatically.
        </p>

        <div className="space-y-3 rounded-lg border border-border shadow-sm p-4">
          <input
            placeholder="ID (e.g. ML-0004)"
            value={form.id}
            onChange={(e) => update("id", e.target.value)}
            className="w-full rounded-md border border-border shadow-sm bg-transparent px-3 py-2 text-sm"
          />
          <select value={form.section} onChange={(e) => update("section", e.target.value)} className="w-full rounded-md border border-border shadow-sm bg-transparent px-3 py-2 text-sm">
            {sections.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input
            placeholder="Topic"
            value={form.topic}
            onChange={(e) => update("topic", e.target.value)}
            className="w-full rounded-md border border-border shadow-sm bg-transparent px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <select value={form.type} onChange={(e) => update("type", e.target.value as QType)} className="flex-1 rounded-md border border-border shadow-sm bg-transparent px-3 py-2 text-sm">
              {["MCQ", "MSQ", "NAT"].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={form.marks} onChange={(e) => update("marks", Number(e.target.value))} className="flex-1 rounded-md border border-border shadow-sm bg-transparent px-3 py-2 text-sm">
              <option value={1}>1 mark</option>
              <option value={2}>2 marks</option>
            </select>
            <select value={form.difficulty} onChange={(e) => update("difficulty", e.target.value)} className="flex-1 rounded-md border border-border shadow-sm bg-transparent px-3 py-2 text-sm">
              {["easy", "medium", "hard"].map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <textarea
            placeholder="Question text"
            value={form.question}
            onChange={(e) => update("question", e.target.value)}
            rows={3}
            className="w-full rounded-md border border-border shadow-sm bg-transparent px-3 py-2 text-sm"
          />
          {form.type !== "NAT" && (
            <textarea
              placeholder="Options, one per line: A) ... / B) ... / C) ... / D) ..."
              value={form.options.join("\n")}
              onChange={(e) => update("options", e.target.value.split("\n"))}
              rows={4}
              className="w-full rounded-md border border-border shadow-sm bg-transparent px-3 py-2 text-sm"
            />
          )}
          <input
            placeholder={form.type === "MCQ" ? "Correct answer letter, e.g. B" : form.type === "MSQ" ? "Correct letters comma-separated, e.g. A,C" : "Correct numeric answer"}
            value={form.correct_answer.join(",")}
            onChange={(e) =>
              update(
                "correct_answer",
                form.type === "NAT" ? [Number(e.target.value)] : e.target.value.split(",").map((s) => s.trim())
              )
            }
            className="w-full rounded-md border border-border shadow-sm bg-transparent px-3 py-2 text-sm"
          />
          <textarea
            placeholder="Explanation"
            value={form.explanation}
            onChange={(e) => update("explanation", e.target.value)}
            rows={2}
            className="w-full rounded-md border border-border shadow-sm bg-transparent px-3 py-2 text-sm"
          />
          <input
            placeholder="Tags, comma-separated"
            value={form.tags.join(",")}
            onChange={(e) => update("tags", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            className="w-full rounded-md border border-border shadow-sm bg-transparent px-3 py-2 text-sm"
          />
          <button onClick={addToDraft} className="w-full rounded-md bg-accent text-white py-2 text-sm">
            Add to draft ({draft.length})
          </button>
        </div>

        {draft.length > 0 && (
          <button onClick={downloadDraft} className="w-full mt-4 rounded-md bg-good text-white py-2 text-sm">
            Download {draft.length} question(s) as JSON
          </button>
        )}
      </div>
    </div>
  );
}
