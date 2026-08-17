"use client";

import Link from "next/link";
import { Pencil, GraduationCap, Cake, BookOpen, Users, Hourglass, Mail, ArrowRight } from "lucide-react";
import { useAppSelector } from "@/store/hooks";

interface ProfileViewProps {
  firstName: string;
  lastName: string;
  age: string;
  qualificationLabel: string;
  field: string;
  currentlyPursuing: boolean;
  categoryLabel: string;
  onEdit: () => void;
}

export default function ProfileView({
  firstName,
  lastName,
  age,
  qualificationLabel,
  field,
  currentlyPursuing,
  categoryLabel,
  onEdit,
}: ProfileViewProps) {
  const email = useAppSelector((s) => s.user.email);
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

  return (
    <div className="max-w-2xl">
      <p className="text-xs uppercase tracking-[0.2em] text-ink-faint">Your profile</p>
      <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">
        {firstName} {lastName}
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        This is what we'll match against exam eligibility rules.
      </p>

      <div className="glass-panel-strong mt-8 overflow-hidden rounded-xl2">
        {/* Illustration banner */}
        <div className="relative flex h-44 items-center justify-center overflow-hidden">
          <svg
            viewBox="0 0 500 176"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <radialGradient id="profileGlow" cx="50%" cy="42%" r="65%">
                <stop offset="0%" stopColor="#B336C2" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#2A0E4A" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="profileRing" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B2FD1" />
                <stop offset="100%" stopColor="#D946A8" />
              </linearGradient>
            </defs>
            <rect width="500" height="176" fill="url(#profileGlow)" />
            <circle cx="90" cy="34" r="3" fill="#D946A8" opacity="0.55" />
            <circle cx="415" cy="132" r="4" fill="#8B2FD1" opacity="0.45" />
            <circle cx="440" cy="46" r="2" fill="#F5F1FB" opacity="0.35" />
            <circle cx="55" cy="130" r="2.5" fill="#F5F1FB" opacity="0.3" />
            <circle cx="250" cy="88" r="54" fill="none" stroke="url(#profileRing)" strokeWidth="2" strokeDasharray="4 7" opacity="0.5" />
            <circle cx="250" cy="88" r="70" fill="none" stroke="#F5F1FB" strokeWidth="1" opacity="0.08" />
          </svg>

          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-accent-gradient font-display text-2xl font-bold text-ink shadow-glow">
            {initials || "?"}
          </div>
        </div>

        {/* Details — 6 cells so the grid always fills cleanly, no empty gap */}
        <div className="grid grid-cols-2 gap-px bg-glass-border sm:grid-cols-3">
          <DetailRow icon={Cake} label="Age" value={age} />
          <DetailRow icon={GraduationCap} label="Qualification" value={qualificationLabel} />
          <DetailRow icon={BookOpen} label="Degree / stream" value={field || "—"} />
          <DetailRow icon={Users} label="Category" value={categoryLabel} />
          <DetailRow
            icon={Hourglass}
            label="Status"
            value={currentlyPursuing ? "Pursuing" : "Completed"}
          />
          <DetailRow icon={Mail} label="Email" value={email ?? "—"} />
        </div>

        <div className="flex flex-wrap gap-3 p-5">
          <Link
            href="/eligible-exams"
            className="flex items-center gap-2 rounded-full bg-accent-gradient px-5 py-2.5 text-sm font-medium text-ink shadow-glow"
          >
            See my eligible exams
            <ArrowRight size={14} />
          </Link>
          <button
            onClick={onEdit}
            className="flex items-center gap-2 rounded-full border border-glass-border px-5 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:border-transparent hover:bg-accent-gradient hover:text-ink"
          >
            <Pencil size={14} />
            Edit profile
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Cake;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 bg-void/40 px-5 py-4">
      <Icon size={16} className="mt-0.5 shrink-0 text-accent-to" />
      <div className="min-w-0">
        <p className="text-xs text-ink-faint">{label}</p>
        <p className="truncate text-sm text-ink">{value}</p>
      </div>
    </div>
  );
}