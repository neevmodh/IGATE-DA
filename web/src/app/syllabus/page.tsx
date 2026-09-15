"use client";

import Link from "next/link";
import SyllabusTracker from "@/components/SyllabusTracker";

export default function SyllabusPage() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Syllabus</h1>
          <Link href="/" className="text-accent hover:underline text-sm">
            ← Home
          </Link>
        </div>
        <SyllabusTracker />
      </main>
    </div>
  );
}
