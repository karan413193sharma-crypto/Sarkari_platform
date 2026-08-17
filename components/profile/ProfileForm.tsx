"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Select from "@/components/ui/Select";
import ProfileView from "@/components/profile/ProfileView";
import { useAppDispatch } from "@/store/hooks";
import { setHasProfile } from "@/store/slices/userSlice";
import type { QualificationLevel } from "@/types/exam";

const QUALIFICATION_LEVELS: { value: QualificationLevel; label: string }[] = [
  { value: "10th", label: "10th" },
  { value: "12th", label: "12th" },
  { value: "diploma", label: "Diploma" },
  { value: "graduate", label: "Graduate" },
  { value: "postgraduate", label: "Postgraduate" },
];

const CATEGORY_OPTIONS = [
  { value: "general", label: "General" },
  { value: "obc", label: "OBC" },
  { value: "sc", label: "SC" },
  { value: "st", label: "ST" },
  { value: "ews", label: "EWS" },
];

function labelFor(list: { value: string; label: string }[], value: string) {
  return list.find((o) => o.value === value)?.label ?? "—";
}

interface FormState {
  firstName: string;
  lastName: string;
  age: string;
  qualificationLevel: QualificationLevel | "";
  field: string;
  currentlyPursuing: boolean;
  category: string;
}

const emptyForm: FormState = {
  firstName: "",
  lastName: "",
  age: "",
  qualificationLevel: "",
  field: "",
  currentlyPursuing: false,
  category: "",
};

type Mode = "loading" | "view" | "edit";

export default function ProfileForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [mode, setMode] = useState<Mode>("loading");
  const [hasSavedProfile, setHasSavedProfile] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function loadProfile() {
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

      if (profile) {
        setForm({
          firstName: profile.first_name ?? "",
          lastName: profile.last_name ?? "",
          age: profile.age ? String(profile.age) : "",
          qualificationLevel: profile.qualification_level ?? "",
          field: profile.field ?? "",
          currentlyPursuing: profile.currently_pursuing ?? false,
          category: profile.category ?? "",
        });
        setHasSavedProfile(true);
        setMode("view");
      } else {
        setMode("edit");
      }
    }

    loadProfile();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("Enter your first and last name.");
      return;
    }
    const ageNum = Number(form.age);
    if (!ageNum || ageNum < 10 || ageNum > 80) {
      setError("Enter a valid age.");
      return;
    }
    if (!form.qualificationLevel) {
      setError("Select your qualification level.");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      router.push("/");
      return;
    }

    const { error: saveError } = await supabase.from("profiles").upsert({
      id: userData.user.id,
      email: userData.user.email,
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      age: ageNum,
      qualification_level: form.qualificationLevel,
      field: form.field.trim(),
      currently_pursuing: form.currentlyPursuing,
      category: form.category || null,
      updated_at: new Date().toISOString(),
    });

    setSaving(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }

    setHasSavedProfile(true);
    dispatch(setHasProfile(true));
    setMode("view");
  }

  if (mode === "loading") {
    return (
      <div className="flex items-center gap-2 text-sm text-ink-muted">
        <Loader2 size={16} className="animate-spin" />
        Loading your profile…
      </div>
    );
  }

  if (mode === "view") {
    return (
      <ProfileView
        firstName={form.firstName}
        lastName={form.lastName}
        age={form.age}
        qualificationLabel={labelFor(QUALIFICATION_LEVELS, form.qualificationLevel)}
        field={form.field}
        currentlyPursuing={form.currentlyPursuing}
        categoryLabel={form.category ? labelFor(CATEGORY_OPTIONS, form.category) : "Prefer not to say"}
        onEdit={() => setMode("edit")}
      />
    );
  }

  return (
    <div className="max-w-xl">
      {hasSavedProfile && (
        <button
          onClick={() => setMode("view")}
          className="mb-4 flex items-center gap-1.5 text-xs text-ink-faint transition-colors hover:text-ink"
        >
          <ArrowLeft size={14} />
          Back to profile
        </button>
      )}

      <p className="text-xs uppercase tracking-[0.2em] text-ink-faint">Your profile</p>
      <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">
        {hasSavedProfile ? "Edit your details" : "Add your details"}
      </h1>
      <p className="mt-3 text-sm text-ink-muted">
        This is what we match against exam eligibility rules — keep it accurate.
      </p>

      <form onSubmit={handleSubmit} className="glass-panel mt-8 space-y-5 rounded-xl2 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name">
            <input
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              placeholder="Aisha"
              className="input-field"
            />
          </Field>
          <Field label="Last name">
            <input
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              placeholder="Sharma"
              className="input-field"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Age">
            <input
              type="number"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              placeholder="21"
              className="input-field"
            />
          </Field>
          <Field label="Category (optional)">
            <Select
              value={form.category}
              onChange={(v) => setForm({ ...form, category: v })}
              placeholder="Prefer not to say"
              options={CATEGORY_OPTIONS}
            />
          </Field>
        </div>

        <Field label="Qualification level">
          <Select
            value={form.qualificationLevel}
            onChange={(v) => setForm({ ...form, qualificationLevel: v as QualificationLevel })}
            placeholder="Select one"
            options={QUALIFICATION_LEVELS}
          />
        </Field>

        <Field label="Degree / stream (optional for 10th)">
          <input
            value={form.field}
            onChange={(e) => setForm({ ...form, field: e.target.value })}
            placeholder="B.Sc Physics, Commerce, etc."
            className="input-field"
          />
        </Field>

        <label className="flex items-center gap-2 text-sm text-ink-muted">
          <input
            type="checkbox"
            checked={form.currentlyPursuing}
            onChange={(e) => setForm({ ...form, currentlyPursuing: e.target.checked })}
            className="h-4 w-4 rounded border-glass-border accent-accent"
          />
          I'm currently pursuing this, haven't finished yet
        </label>

        {error && <p className="text-xs text-red-300">{error}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-full bg-accent-gradient px-6 py-2.5 text-sm font-medium text-ink shadow-glow disabled:opacity-60"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            Save profile
          </button>

          {hasSavedProfile && (
            <button
              type="button"
              onClick={() => setMode("view")}
              className="rounded-full px-5 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs text-ink-muted">{label}</label>
      {children}
    </div>
  );
}