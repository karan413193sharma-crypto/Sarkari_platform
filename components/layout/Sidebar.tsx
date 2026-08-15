"use client";

import { useState } from "react";
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

const NAV_ITEMS = [
  { label: "Home", icon: Home, href: "#home" },
  { label: "Explore exams", icon: Compass, href: "#exams" },
  { label: "Check eligibility", icon: ClipboardCheck, href: "#eligibility" },
  { label: "Categories", icon: LayoutGrid, href: "#categories" },
  { label: "About", icon: Info, href: "#about" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        "sticky top-4 ml-4 mt-4 mb-4 flex h-[calc(100vh-2rem)] flex-col justify-between",
        "glass-panel rounded-xl2 transition-all duration-300",
        collapsed ? "w-[76px]" : "w-[224px]"
      )}
    >
      <div>
        <div className="flex items-center gap-2 px-4 py-5">
          <div className="h-8 w-8 shrink-0 rounded-lg bg-accent-gradient" />
          {!collapsed && (
            <span className="font-display text-sm font-bold tracking-wide">
              SARKARI<span className="text-gradient">PATH</span>
            </span>
          )}
        </div>

        <nav className="mt-4 flex flex-col gap-1 px-3">
          {NAV_ITEMS.map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-muted",
                "transition-colors hover:bg-glass-strong hover:text-ink"
              )}
            >
              <Icon size={18} strokeWidth={1.75} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </a>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-1 px-3 pb-4">
        <a
          href="#login"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-muted transition-colors hover:bg-glass-strong hover:text-ink"
        >
          <UserCircle2 size={18} strokeWidth={1.75} className="shrink-0" />
          {!collapsed && <span>Login / Sign up</span>}
        </a>

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
