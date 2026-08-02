"use client";

import { useEffect, useState } from "react";
import { scoreBand, formatDate } from "../../lib/helpers";
import type { Submission } from "../../lib/types";

interface HistoryScreenProps {
  loading: boolean;
  error: string | null;
  history: Submission[];
  onOpen: (submission: Submission) => void;
}

export default function HistoryScreen({ loading, error, history, onOpen }: HistoryScreenProps) {
  const [width, setWidth] = useState<number | null>(null);
  useEffect(() => {
    setWidth(window.innerWidth);
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const isMobile = width === null ? true : width < 720;

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h1
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            fontSize: 26,
            lineHeight: 1.25,
            letterSpacing: "-.7px",
            margin: "0 0 6px",
          }}
        >
          History
        </h1>
        <p style={{ margin: 0, color: "var(--mut)", fontSize: 15 }}>
          {loading ? "Loading..." : `${history.length} gradings saved.`}
        </p>
      </div>

      {error && <p style={{ color: "var(--dang)", fontSize: 14 }}>{error}</p>}

      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {history.map((h) => {
            const band = scoreBand(h.result.score);
            return (
              <button
                key={h.id}
                onClick={() => onOpen(h)}
                style={{
                  width: "100%",
                  minHeight: 44,
                  textAlign: "left",
                  background: "var(--card)",
                  border: "1px solid var(--line)",
                  borderRadius: 16,
                  padding: 16,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  fontFamily: "inherit",
                }}
              >
                <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>
                    {h.student_name}
                  </span>
                  <span style={{ fontSize: 13, color: "var(--mut)" }}>
                    {formatDate(h.created_at)} · {h.result.structure}
                  </span>
                </span>
                <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
                  <span
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 22,
                      fontWeight: 700,
                      letterSpacing: "-.6px",
                      color: "var(--ink)",
                    }}
                  >
                    {h.result.score}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: band.color }}>{band.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr>
                {["Student", "Score", "Status", "Structure", "Date"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "12px 16px",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--mut)",
                      borderBottom: "1px solid var(--line)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map((h) => {
                const band = scoreBand(h.result.score);
                return (
                  <tr key={h.id} onClick={() => onOpen(h)} style={{ cursor: "pointer" }}>
                    <td style={{ padding: "14px 16px", borderBottom: "1px solid var(--line)", fontWeight: 600 }}>
                      {h.student_name}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        borderBottom: "1px solid var(--line)",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 700,
                      }}
                    >
                      {h.result.score}
                    </td>
                    <td style={{ padding: "14px 16px", borderBottom: "1px solid var(--line)", fontWeight: 600, color: band.color }}>
                      {band.label}
                    </td>
                    <td style={{ padding: "14px 16px", borderBottom: "1px solid var(--line)", color: "var(--mut)" }}>
                      {h.result.structure}
                    </td>
                    <td style={{ padding: "14px 16px", borderBottom: "1px solid var(--line)", color: "var(--mut)" }}>
                      {formatDate(h.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
