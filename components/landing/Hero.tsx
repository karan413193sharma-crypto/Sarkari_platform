"use client";

import { ArrowUpRight, Sparkles } from "lucide-react";
import { useEligibilityClick } from "@/lib/hooks/useEligibilityClick";
import HeroVisual from "@/components/landing/HeroVisual";

export default function Hero() {
  const handleEligibilityClick = useEligibilityClick();

  return (
    <section id="home" className="relative overflow-hidden px-6 pt-10 pb-24 md:px-14 md:pt-18">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 xl:gap-16">
        <div className="min-w-0">
          <div className="glass-panel mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-ink-muted">
            <Sparkles size={14} className="text-accent-to" />
            Built for 10th, 12th &amp; degree students
          </div>

          <h1 className="font-display text-[11vw] font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl md:text-6xl lg:text-[3.75rem] xl:text-7xl">
            <span className="block">Find the</span>
            <span className="block text-gradient">exam you</span>
            <span className="block">qualify for</span>
          </h1>

          <p className="mt-8 max-w-xl text-base text-ink-muted md:text-lg">
            Add your qualification once. See every government exam you&apos;re eligible
            for right now, what your current degree unlocks next, and the
            official syllabus, dates and apply links — all in one place.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              onClick={handleEligibilityClick}
              className="group flex items-center gap-2 rounded-full bg-accent-gradient px-6 py-3 text-sm font-medium text-ink shadow-glow transition-transform hover:scale-[1.03]"
            >
              Check my eligibility
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </button>
            <a
              href="#exams"
              className="glass-panel rounded-full px-6 py-3 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
            >
              Browse all exams
            </a>
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}