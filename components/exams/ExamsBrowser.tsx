"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import type { Exam } from "@/types/exam";
import ExamCard from "./ExamCard";

export default function ExamsBrowser({ exams }: { exams: Exam[] }) {
  const searchParams = useSearchParams();
  const categories = useMemo(
    () => Array.from(new Set(exams.map((e) => e.categoryCode))),
    [exams]
  );
  const initialCategory = searchParams.get("category");
  const [active, setActive] = useState<string>(
    initialCategory && categories.includes(initialCategory) ? initialCategory : "All"
  );

  const filtered = active === "All" ? exams : exams.filter((e) => e.categoryCode === active);

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-ink-faint">Categories</p>
      <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">
        Every government exam.
      </h1>
      <p className="mt-3 max-w-xl text-sm text-ink-muted">
        Pick a category, or view everything. Tap any exam for eligibility, syllabus and the
        official apply link.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {["All", ...categories].map((code) => (
          <button
            key={code}
            onClick={() => setActive(code)}
            className={clsx(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              active === code
                ? "bg-accent-gradient text-ink"
                : "glass-panel text-ink-muted hover:text-ink"
            )}
          >
            {code}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((exam) => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-sm text-ink-faint">No exams in this category yet.</p>
      )}
    </div>
  );
}