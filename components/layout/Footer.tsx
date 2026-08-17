"use client";

import { useEligibilityClick } from "@/lib/hooks/useEligibilityClick";

export default function Footer() {
  const handleEligibilityClick = useEligibilityClick();

  return (
    <footer id="about" className="mt-8 px-6 py-10 md:px-14">
      <div className="glass-panel rounded-xl2 px-8 py-10 text-center">
        <h3 className="font-display text-2xl font-bold md:text-3xl">
          Not sure what you're eligible for yet?
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-muted">
          It takes under a minute to add your qualification and see your
          matches — no account required to look.
        </p>
        <button
          onClick={handleEligibilityClick}
          className="mt-6 inline-block rounded-full bg-accent-gradient px-6 py-3 text-sm font-medium text-ink shadow-glow"
        >
          Check my eligibility
        </button>
      </div>

      <p className="mt-8 text-center text-xs text-ink-faint">
        SarkariPath — exam data sourced from official notifications.
      </p>
    </footer>
  );
}