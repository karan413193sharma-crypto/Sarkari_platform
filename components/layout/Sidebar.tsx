"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  Compass,
  ClipboardCheck,
  LayoutGrid,
  Info,
  ChevronsLeft,
  UserCircle2,
} from "lucide-react";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openAuthModal } from "@/store/slices/uiSlice";
import { useEligibilityClick } from "@/lib/hooks/useEligibilityClick";

// Plain links — always resolve to a real page/section, work from anywhere in the app.
const NAV_LINKS = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Explore exams", icon: Compass, href: "/exams" },
  { label: "Categories", icon: LayoutGrid, href: "/exams" },
  { label: "About", icon: Info, href: "/#about" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((s) => s.user.isLoggedIn);
  const handleEligibilityClick = useEligibilityClick();

  return (
    <aside
      className={clsx(
        "sticky top-4 ml-4 mt-4 mb-4 flex h-[calc(100vh-2rem)] flex-col justify-between",
        "glass-panel rounded-xl2 transition-all duration-300",
        collapsed ? "w-[76px]" : "w-[224px]"
      )}
    >
      <div>
        <Link href="/" className="flex items-center gap-2 px-4 py-5">
          <div className="h-8 w-8 shrink-0 rounded-lg bg-accent-gradient" />
          {!collapsed && (
            <span className="font-display text-sm font-bold tracking-wide">
              SARKARI<span className="text-gradient">PATH</span>
            </span>
          )}
        </Link>

        <nav className="mt-4 flex flex-col gap-1 px-3">
          {NAV_LINKS.map(({ label, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-muted",
                "transition-colors hover:bg-glass-strong hover:text-ink"
              )}
            >
              <Icon size={18} strokeWidth={1.75} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          ))}

          <button
            onClick={handleEligibilityClick}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-muted transition-colors hover:bg-glass-strong hover:text-ink"
          >
            <ClipboardCheck size={18} strokeWidth={1.75} className="shrink-0" />
            {!collapsed && <span>Check eligibility</span>}
          </button>
        </nav>
      </div>

      <div className="flex flex-col gap-1 px-3 pb-4">
        {!isLoggedIn && (
          <button
            onClick={() => dispatch(openAuthModal("login"))}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-muted transition-colors hover:bg-glass-strong hover:text-ink"
          >
            <UserCircle2 size={18} strokeWidth={1.75} className="shrink-0" />
            {!collapsed && <span>Login / Sign up</span>}
          </button>
        )}

        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-faint transition-colors hover:bg-glass-strong hover:text-ink"
        >
          <ChevronsLeft
            size={18}
            strokeWidth={1.75}
            className={clsx("shrink-0 transition-transform", collapsed && "rotate-180")}
          />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}