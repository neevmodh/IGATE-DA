"use client";

import Image from "next/image";

import Link from "next/link";
import cheatsheets from "@/data/cheatsheets.json";

export default function Cheatsheets() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2.5"><Image src="/gate-logo.svg" alt="" width={22} height={20} /><h1 className="text-2xl font-bold">Cheat Sheets</h1></div>
          <Link href="/" className="text-accent hover:underline text-sm">
            ← Home
          </Link>
        </div>
        <div className="space-y-4">
          {Object.entries(cheatsheets).map(([section, notes]) => (
            <div key={section} className="rounded-lg border border-border shadow-sm p-4">
              <h2 className="font-medium mb-2">{section}</h2>
              <p className="text-sm text-ink-2 whitespace-pre-wrap">{notes}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
