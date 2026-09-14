"use client";

import Link from "next/link";
import cheatsheets from "@/data/cheatsheets.json";

export default function Cheatsheets() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Cheat Sheets</h1>
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            ← Home
          </Link>
        </div>
        <div className="space-y-4">
          {Object.entries(cheatsheets).map(([section, notes]) => (
            <div key={section} className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
              <h2 className="font-medium mb-2">{section}</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">{notes}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
