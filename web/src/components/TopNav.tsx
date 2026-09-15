"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Home" },
  { href: "/practice", label: "Practice" },
  { href: "/analyze", label: "Analyze" },
  { href: "/syllabus", label: "Syllabus" },
];

const MORE = [
  { href: "/builder", label: "Custom Test" },
  { href: "/test?mode=pyq&count=65", label: "PYQ Only" },
  { href: "/browse", label: "Browse" },
  { href: "/bookmarks", label: "Bookmarks" },
  { href: "/mistakes", label: "Mistakes" },
  { href: "/cheatsheets", label: "Cheat Sheets" },
  { href: "/resources", label: "Study Resources" },
  { href: "/admin", label: "Add Questions" },
];

export default function TopNav() {
  const pathname = usePathname();
  if (pathname === "/test" || pathname === "/results") return null;

  const moreActive = MORE.some((m) => m.href.startsWith(pathname) && pathname !== "/");

  return (
    <div className="sticky top-0 z-10 bg-surface border-b border-border">
      <div className="max-w-[1120px] mx-auto px-10 h-[68px] flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 shrink-0">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-tint to-transparent" />
              <div className="absolute inset-[2px] rounded-full bg-surface border border-border shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                <Image src="/gate-logo.svg" alt="GATE 2027 emblem" width={40} height={37} />
              </div>
            </div>
            <span className="display text-[18px] font-extrabold tracking-tight">I-GATE</span>
          </Link>
          <div className="flex items-center gap-0.5">
            {TABS.map((t) => {
              const active = pathname === t.href;
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className={`px-3.5 py-2 rounded-lg text-[13.5px] transition-colors ${
                    active
                      ? "bg-accent-tint text-accent-ink font-bold"
                      : "text-ink-3 font-medium hover:text-ink hover:bg-border-soft"
                  }`}
                >
                  {t.label}
                </Link>
              );
            })}
            <div className="relative group">
              <button
                className={`px-3.5 py-2 rounded-lg text-[13.5px] flex items-center gap-1 transition-colors ${
                  moreActive ? "bg-accent-tint text-accent-ink font-bold" : "text-ink-3 font-medium hover:text-ink hover:bg-border-soft"
                }`}
              >
                More
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <div className="absolute left-0 top-full pt-1.5 hidden group-hover:block z-20">
                <div className="bg-surface border border-border rounded-xl shadow-lg p-1.5 w-48">
                  {MORE.map((m) => (
                    <Link
                      key={m.href}
                      href={m.href}
                      className="block px-3 py-2 rounded-md text-[13px] text-ink-2 hover:bg-accent-tint hover:text-accent-ink transition-colors"
                    >
                      {m.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[30px] h-[30px] rounded-full bg-accent-tint text-accent-ink flex items-center justify-center text-[12px] font-semibold">
          N
        </div>
      </div>
    </div>
  );
}
