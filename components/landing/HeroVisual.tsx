"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const PREVIEW_EXAMS = [
  { code: "SSC CGL", tag: "Eligible now", delay: "0s" },
  { code: "IBPS PO", tag: "Opens Aug 2026", delay: "0.15s" },
  { code: "RRB NTPC", tag: "Eligible now", delay: "0.3s" },
];

const ORBIT_BADGES = [
  { label: "UPSC", style: "top-[8%] left-[6%]", duration: "14s" },
  { label: "SSC", style: "top-[18%] right-[4%]", duration: "11s" },
  { label: "BANK", style: "bottom-[22%] left-[0%]", duration: "16s" },
  { label: "RRB", style: "bottom-[8%] right-[8%]", duration: "12s" },
];

export default function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none lg:mx-0">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 rounded-full bg-accent/25 blur-3xl animate-hero-glow"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/3 h-40 w-40 rounded-full bg-accent-to/20 blur-2xl animate-hero-glow"
        style={{ animationDelay: "1.2s" }}
      />

      {ORBIT_BADGES.map((b) => (
        <span
          key={b.label}
          aria-hidden
          className={`glass-panel absolute z-20 hidden rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-muted animate-hero-float md:inline ${b.style}`}
          style={{ animationDuration: b.duration }}
        >
          {b.label}
        </span>
      ))}

      <div className="glass-panel-strong relative overflow-hidden rounded-xl2 shadow-glow">
        <div className="relative aspect-[5/6] min-h-[320px] sm:min-h-[380px]">
          <Image
            src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=80"
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 480px"
            className="object-cover object-center scale-105 animate-hero-kenburns"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/75 to-deep/20" />
          <div className="absolute inset-0 bg-accent-gradient opacity-[0.12] mix-blend-soft-light" />

          <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6">
            <div className="glass-panel rounded-xl p-4 backdrop-blur-md">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-faint">
                  Eligibility preview
                </p>
                <span className="flex items-center gap-1 text-[11px] text-accent-to">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-to opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-to" />
                  </span>
                  Live
                </span>
              </div>

              <ul className="mt-3 space-y-2">
                {PREVIEW_EXAMS.map((exam) => (
                  <li
                    key={exam.code}
                    className="flex items-center justify-between gap-3 rounded-lg border border-glass-border bg-glass/80 px-3 py-2.5 opacity-0 animate-hero-slide-up"
                    style={{ animationDelay: exam.delay, animationFillMode: "forwards" }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <CheckCircle2 size={16} className="shrink-0 text-accent-to" />
                      <span className="truncate text-sm font-medium text-ink">{exam.code}</span>
                    </div>
                    <span className="shrink-0 text-[11px] text-ink-muted">{exam.tag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
