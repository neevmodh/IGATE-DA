"use client";

import Image from "next/image";
import questions from "@/data/questions.json";
import { Question } from "@/lib/types";
import MotivationBar from "@/components/MotivationBar";

const allQuestions = questions as Question[];

const navCards = [
  {
    href: "/builder",
    title: "Custom Test",
    desc: "Pick sections & difficulty",
    icon: (
      <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h13M21 18h0" />
    ),
    circles: [
      { cx: 16, cy: 6 },
      { cx: 8, cy: 12 },
      { cx: 17, cy: 18 },
    ],
  },
  {
    href: "/test?mode=pyq&count=65",
    title: "PYQ Only",
    desc: "Real past GATE DA papers",
    icon: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M9 13h6M9 17h6" />
      </>
    ),
  },
  {
    href: "/browse",
    title: "Browse",
    desc: "Search the question bank",
    icon: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </>
    ),
  },
  {
    href: "/bookmarks",
    title: "Bookmarks",
    desc: "Saved questions",
    icon: <path d="m12 2 3 7 7 .5-5.5 4.5 2 7L12 17l-6.5 4 2-7L2 9.5 9 9z" />,
  },
  {
    href: "/mistakes",
    title: "Mistakes",
    desc: "Auto-collected wrong answers",
    icon: <path d="M18 6 6 18M6 6l12 12" />,
    warn: true,
  },
  {
    href: "/cheatsheets",
    title: "Cheat Sheets",
    desc: "Quick formulas per section",
    icon: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M9 13h6M9 17h6M9 9h1" />
      </>
    ),
  },
];

export default function Home() {
  return (
    <div className="flex-1 bg-bg text-ink">
      <main className="max-w-[1120px] mx-auto px-10 py-9">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-16 h-16 rounded-full bg-surface border border-border shadow-md flex items-center justify-center shrink-0">
            <Image src="/gate-logo.svg" alt="GATE 2027 emblem" width={54} height={50} />
          </div>
          <div>
            <h1 className="display text-[30px] font-extrabold mb-1">Good to see you, Neev.</h1>
            <p className="text-ink-2 text-[15px]">
              GATE DA 2027 &middot; Data Science &amp; Artificial Intelligence
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-5 mb-5">
          <a
            href="/test?mode=daily"
            className="relative overflow-hidden rounded-2xl border border-border shadow-sm bg-surface p-7 flex flex-col justify-between"
          >
            <Image
              src="/gate-logo.svg"
              alt=""
              width={320}
              height={296}
              className="absolute -right-14 -bottom-16 opacity-[0.14] pointer-events-none select-none"
            />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3.5">
                <div className="w-7 h-7 rounded-lg bg-warn-tint flex items-center justify-center">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c2410c" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2 3 14h7l-1 8 11-14h-7z" />
                  </svg>
                </div>
                <span className="text-[13px] font-semibold text-ink-2 uppercase tracking-wide">Today&apos;s Quiz</span>
              </div>
              <h2 className="display text-[22px] font-bold mb-2">10 questions, mixed from your weak topics</h2>
              <p className="text-ink-2 text-sm mb-5">Includes spaced-repetition reviews due today.</p>
            </div>
            <span className="relative self-start rounded-xl bg-accent text-white px-5 py-3 text-sm font-semibold">
              Start Daily Quiz
            </span>
          </a>

          <MotivationBar />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mb-8">
          {navCards.map((c) => (
            <a
              key={c.href}
              href={c.href}
              className="rounded-xl border border-border shadow-sm bg-surface p-4.5 flex flex-col gap-2.5 hover:border-accent/40 transition-colors"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.warn ? "bg-warn-tint" : "bg-accent-tint"}`}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={c.warn ? "#c2410c" : "var(--color-accent-ink)"}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {c.icon}
                  {c.circles?.map((cc, i) => (
                    <circle key={i} cx={cc.cx} cy={cc.cy} r={2} />
                  ))}
                </svg>
              </div>
              <div>
                <div className="text-[13.5px] font-semibold">{c.title}</div>
                <div className="text-[11.5px] text-ink-3">{c.desc}</div>
              </div>
            </a>
          ))}
        </div>

        <div className="flex items-center justify-between pt-5 border-t border-border-soft text-[13px] text-ink-3">
          <span>{allQuestions.length} questions in bank</span>
          <a href="/admin" className="text-accent font-medium hover:underline">
            + Add questions
          </a>
        </div>
      </main>
    </div>
  );
}
