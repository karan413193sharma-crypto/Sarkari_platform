import { Suspense } from "react";
import ExamsBrowser from "@/components/exams/ExamsBrowser";
import { EXAMS } from "@/lib/data/exams";

export default function ExamsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-ink-muted">Loading…</p>}>
      <ExamsBrowser exams={EXAMS} />
    </Suspense>
  );
}