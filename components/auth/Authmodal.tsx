"use client";

import { useState } from "react";
import { X, Loader2, MailCheck } from "lucide-react";
import clsx from "clsx";
import { createClient } from "@/lib/supabase/client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeAuthModal, setAuthMode } from "@/store/slices/uiSlice";
import { setLoggedIn } from "@/store/slices/userSlice";

export default function AuthModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((s) => s.ui.authModalOpen);
  const mode = useAppSelector((s) => s.ui.authMode);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsEmailConfirm, setNeedsEmailConfirm] = useState(false);

  if (!isOpen) return null;

  function resetAndClose() {
    setEmail("");
    setPassword("");
    setError(null);
    setNeedsEmailConfirm(false);
    dispatch(closeAuthModal());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    if (mode === "signup") {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      setLoading(false);

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      // If email confirmation is required in the Supabase project, no session
      // comes back yet — the user has to click the link Supabase emails them.
      if (data.session) {
        dispatch(setLoggedIn(true));
        resetAndClose();
      } else {
        setNeedsEmailConfirm(true);
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      setLoading(false);

      if (signInError) {
        setError(signInError.message);
        return;
      }

      dispatch(setLoggedIn(true));
      resetAndClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-void/70 backdrop-blur-sm px-4"
      onClick={resetAndClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-panel-strong relative w-full max-w-sm rounded-xl2 p-7"
      >
        <button
          onClick={resetAndClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-ink-faint transition-colors hover:text-ink"
        >
          <X size={18} />
        </button>

        {needsEmailConfirm ? (
          <div className="py-4 text-center">
            <MailCheck size={32} className="mx-auto text-accent-to" />
            <h2 className="mt-4 font-display text-lg font-bold">Check your email</h2>
            <p className="mt-2 text-sm text-ink-muted">
              We sent a confirmation link to <span className="text-ink">{email}</span>.
              Confirm it, then come back and log in.
            </p>
            <button
              onClick={() => {
                setNeedsEmailConfirm(false);
                dispatch(setAuthMode("login"));
              }}
              className="mt-6 w-full rounded-full bg-accent-gradient py-2.5 text-sm font-medium text-ink"
            >
              Back to login
            </button>
          </div>
        ) : (
          <>
            <h2 className="font-display text-xl font-bold">
              {mode === "signup" ? "Create your account" : "Log in"}
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              {mode === "signup"
                ? "Save your qualification and get notified about matching exams."
                : "Welcome back — log in to see your eligible exams."}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <div>
                <label htmlFor="auth-email" className="mb-1.5 block text-xs text-ink-muted">
                  Email
                </label>
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
                  className="w-full rounded-lg border border-glass-border bg-glass px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint outline-none focus:border-accent-to"
                />
              </div>

              <div>
                <label htmlFor="auth-password" className="mb-1.5 block text-xs text-ink-muted">
                  Password
                </label>
                <input
                  id="auth-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  className="w-full rounded-lg border border-glass-border bg-glass px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint outline-none focus:border-accent-to"
                />
              </div>

              {error && <p className="text-xs text-red-300">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-accent-gradient py-2.5 text-sm font-medium text-ink shadow-glow disabled:opacity-60"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {mode === "signup" ? "Create account" : "Log in"}
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-ink-faint">
              {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
              <button
                onClick={() =>
                  dispatch(setAuthMode(mode === "signup" ? "login" : "signup"))
                }
                className="text-ink-muted underline underline-offset-2 hover:text-ink"
              >
                {mode === "signup" ? "Log in" : "Create one"}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}