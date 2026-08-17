import Link from "next/link";
import { ArrowUpRight, GraduationCap, Calendar } from "lucide-react";
import type { Exam } from "@/types/exam";

const QUALIFICATION_LABELS: Record<Exam["minQualification"], string> = {
  "10th": "10th pass",
  "12th": "12th pass",
  diploma: "Diploma",
  graduate: "Graduate",
  postgraduate: "Postgraduate",
};

export default function ExamCard({ exam }: { exam: Exam }) {
  return (
    <Link
      href={`/exams/${exam.slug}`}
      className="glass-panel group flex flex-col rounded-xl2 p-5 transition-all hover:border-glass-border hover:shadow-glow"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-glass-strong px-2.5 py-1 text-[11px] font-medium text-accent-to">
          {exam.categoryCode}
        </span>
        <ArrowUpRight
          size={16}
          className="shrink-0 text-ink-faint transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
        />
      </div>

      <h3 className="mt-3 font-display text-base font-bold leading-snug text-ink">
        {exam.name}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{exam.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-glass-border pt-3 text-xs text-ink-faint">
        <span className="flex items-center gap-1.5">
          <GraduationCap size={13} />
          {QUALIFICATION_LABELS[exam.minQualification]}+
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar size={13} />
          {exam.minAge}–{exam.maxAge} yrs
        </span>
      </div>
    </Link>
  );
}