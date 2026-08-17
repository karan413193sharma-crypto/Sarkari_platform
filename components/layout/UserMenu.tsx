"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSession } from "@/store/slices/userSlice";

export default function UserMenu() {
  const isLoggedIn = useAppSelector((s) => s.user.isLoggedIn);
  const email = useAppSelector((s) => s.user.email);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isLoggedIn) return null;

  const initial = email ? email[0].toUpperCase() : "?";

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    dispatch(setSession({ isLoggedIn: false, email: null }));
    setOpen(false);
    router.push("/");
  }

  return (
    <div ref={menuRef} className="fixed right-6 top-6 z-50">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        className="glass-panel flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-ink transition-transform hover:scale-105"
      >
        {initial}
      </button>

      {open && (
        <div className="glass-panel-strong absolute right-0 mt-2 w-52 rounded-xl2 p-2">
          <p className="truncate px-3 py-2 text-xs text-ink-faint">{email}</p>
          <button
            onClick={() => {
              setOpen(false);
              router.push("/profile");
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink-muted transition-colors hover:bg-glass-strong hover:text-ink"
          >
            <User size={16} />
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink-muted transition-colors hover:bg-glass-strong hover:text-ink"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}