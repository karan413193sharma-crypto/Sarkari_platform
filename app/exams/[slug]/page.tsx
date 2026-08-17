import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, GraduationCap, Calendar, FileText, Bell } from "lucide-react";
import { EXAMS, getExamBySlug } from "@/lib/data/exams";

const QUALIFICATION_LABELS: Record<string, string> = {
  "10th": "10th pass",
  "12th": "12th pass",
  diploma: "Diploma",
  graduate: "Graduate",
  postgraduate: "Postgraduate",
};

export function generateStaticParams() {
  return EXAMS.map((exam) => ({ slug: exam.slug }));
}

export default function ExamDetailPage({ params }: { params: { slug: string } }) {
  const exam = getExamBySlug(params.slug);

  if (!exam) {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      <Link
        href="/exams"
        className="mb-6 flex items-center gap-1.5 text-xs text-ink-faint transition-colors hover:text-ink"
      >
        <ArrowLeft size={14} />
        Back to all exams
      </Link>

      <span className="rounded-full bg-glass-strong px-3 py-1 text-xs font-medium text-accent-to">
        {exam.category}
      </span>

      <h1 className="mt-3 font-display text-3xl font-bold md:text-4xl">{exam.name}</h1>
      <p className="mt-3 text-sm text-ink-muted">{exam.description}</p>

      <div className="glass-panel mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl2 bg-glass-border sm:grid-cols-4">
        <Stat icon={GraduationCap} label="Minimum qualification" value={`${QUALIFICATION_LABELS[exam.minQualification]}+`} />
        <Stat icon={Calendar} label="Age limit" value={`${exam.minAge}–${exam.maxAge} yrs`} />
        <Stat icon={Bell} label="Notification" value={exam.notificationDate ?? "Not announced"} />
        <Stat icon={FileText} label="Category" value={exam.categoryCode} />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={exam.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-accent-gradient px-6 py-3 text-sm font-medium text-ink shadow-glow transition-transform hover:scale-[1.02]"
        >
          Apply on official site
          <ArrowUpRight size={16} />
        </a>
        {exam.syllabusUrl && (
          <a
            href={exam.syllabusUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-panel flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            View syllabus
            <ArrowUpRight size={16} />
          </a>
        )}
      </div>

      <p className="mt-6 text-xs text-ink-faint">
        Eligibility shown here is a general guide — always confirm exact criteria on the official
        notification before applying.
      </p>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-void/40 px-4 py-4">
      <Icon size={15} className="text-accent-to" />
      <p className="mt-2 text-xs text-ink-faint">{label}</p>
      <p className="mt-0.5 text-sm text-ink">{value}</p>
    </div>
  );
}