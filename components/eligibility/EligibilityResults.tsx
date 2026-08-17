"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { EXAMS } from "@/lib/data/exams";
import { getEligibility, type EligibilityResult } from "@/lib/eligibility/match";
import ExamCard from "@/components/exams/ExamCard";
import type { QualificationLevel } from "@/types/exam";

export default function EligibilityResults() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [result, setResult] = useState<EligibilityResult | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        router.push("/");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userData.user.id)
        .maybeSingle();

      if (!profile || !profile.qualification_level || !profile.age) {
        router.push("/profile");
        return;
      }

      setFirstName(profile.first_name ?? "");

      const eligibility = getEligibility(
        {
          qualificationLevel: profile.qualification_level as QualificationLevel,
          currentlyPursuing: profile.currently_pursuing ?? false,
          age: profile.age,
        },
        EXAMS
      );

      setResult(eligibility);
      setLoading(false);
    }

    load();
  }, [router]);

  if (loading || !result) {
    return (
      <div className="flex items-center gap-2 text-sm text-ink-muted">
        <Loader2 size={16} className="animate-spin" />
        Matching your profile against exams…
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-ink-faint">Your matches</p>
      <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">
        {firstName ? `${firstName}, here's what you qualify for` : "Here's what you qualify for"}
      </h1>

      <section className="mt-8">
        <h2 className="font-display text-lg font-bold">
          Eligible now <span className="text-ink-faint">({result.eligible.length})</span>
        </h2>

        {result.eligible.length === 0 ? (
          <p className="mt-3 text-sm text-ink-muted">
            No exact matches yet for your saved qualification and age. Browse everything in{" "}
            <a href="/exams" className="underline underline-offset-2 hover:text-ink">
              Categories
            </a>{" "}
            instead, or check back as new exams open.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.eligible.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        )}
      </section>

      {result.upcoming.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-lg font-bold">
            Unlocks once you finish{" "}
            <span className="text-ink-faint">({result.upcoming.length})</span>
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            You're currently pursuing this qualification — these open up once it's complete.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.upcoming.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}