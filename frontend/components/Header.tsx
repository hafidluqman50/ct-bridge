"use client";

import type { Tab } from "../lib/types";

const TABS: [Tab, string][] = [
  ["grade", "Grade"],
  ["code", "Code"],
  ["history", "History"],
  ["class", "Class"],
];

interface HeaderProps {
  tab: Tab;
  onTabChange: (tab: Tab) => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export default function Header({ tab, onTabChange, theme, onToggleTheme }: HeaderProps) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "var(--card)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: 19,
              letterSpacing: "-.4px",
              color: "var(--ink)",
            }}
          >
            CT-Bridge
          </span>
          <span style={{ fontSize: 12, color: "var(--mut)" }}>Flowchart grading</span>
        </div>
        <button
          onClick={onToggleTheme}
          style={{
            minHeight: 44,
            padding: "10px 14px",
            border: "1px solid var(--line)",
            background: "transparent",
            color: "var(--mut)",
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
      </div>
      <nav
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "0 8px",
          display: "flex",
          gap: 4,
          overflowX: "auto",
        }}
      >
        {TABS.map(([key, label]) => {
          const on = tab === key || (key === "grade" && tab === "result");
          return (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              style={{
                minHeight: 44,
                padding: "12px 14px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: 14,
                fontFamily: "inherit",
                whiteSpace: "nowrap",
                color: on ? "var(--brand)" : "var(--mut)",
                fontWeight: on ? 600 : 500,
                boxShadow: on ? "inset 0 -2px 0 var(--brand)" : "none",
              }}
            >
              {label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
