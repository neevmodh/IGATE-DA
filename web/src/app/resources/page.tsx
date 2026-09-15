"use client";

import Image from "next/image";
import resources from "@/data/resources.json";

const TYPE_ICON: Record<string, string> = {
  video: "▶",
  notes: "📄",
  practice: "✎",
};

export default function Resources() {
  return (
    <div className="flex-1 bg-bg text-ink">
      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex items-center gap-2.5 mb-2">
          <Image src="/gate-logo.svg" alt="" width={22} height={20} />
          <h1 className="text-2xl font-bold">Study Resources</h1>
        </div>
        <p className="text-sm text-ink-3 mb-8">
          Curated free YouTube channels and notes, topic-wise, to pair with practice here.
        </p>

        <div className="space-y-5">
          {resources.map((r) => (
            <div key={r.section} className="rounded-xl border border-border shadow-sm bg-surface p-5">
              <h2 className="font-semibold text-[15px] mb-3">{r.section}</h2>
              <div className="flex flex-col gap-2.5">
                {r.items.map((it) => (
                  <a
                    key={it.url + it.title}
                    href={it.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2.5 rounded-lg px-2.5 py-2 hover:bg-border-soft transition-colors"
                  >
                    <span className="text-accent text-sm mt-0.5">{TYPE_ICON[it.type] ?? "•"}</span>
                    <span>
                      <span className="block text-[13.5px] font-medium">{it.title}</span>
                      <span className="block text-[11.5px] text-ink-3">{it.source}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-ink-3 mt-6 text-center">
          External links — third-party content, not verified/hosted by this app.
        </p>
      </main>
    </div>
  );
}
