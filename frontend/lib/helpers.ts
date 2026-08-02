import type { CSSProperties } from "react";
import type { ScoreBand, TaggedCodeLine } from "./types";

/** Score band matching the design's thresholds: >=80 Good, >=60 Needs Work, else Poor. */
export function scoreBand(score: number): ScoreBand {
  if (score >= 80) return { label: "Good", color: "var(--ok)" };
  if (score >= 60) return { label: "Needs Work", color: "var(--warn)" };
  return { label: "Poor", color: "var(--dang)" };
}

const SISWA_MARKER = /^\s*#\s*===\s*SISWA\s*===\s*$/i;
const AI_MARKER = /^\s*#\s*===\s*AI\s*===\s*$/i;

/**
 * The codegen backend is prompted to mark code with fixed, literal markers:
 *   # ===SISWA===
 *   # ===AI===
 * This splits the code string into per-line { text, origin }, dropping the
 * marker lines themselves (they're parsing directives, not real code), so
 * the UI can show "from student's drawing" / "completed by AI" tagging.
 */
export function tagCodeLines(code: string): TaggedCodeLine[] {
  const lines = (code || "").split("\n");
  let mode: TaggedCodeLine["origin"] = "siswa";
  const tagged: TaggedCodeLine[] = [];
  for (const text of lines) {
    if (SISWA_MARKER.test(text)) {
      mode = "siswa";
      continue;
    }
    if (AI_MARKER.test(text)) {
      mode = "ai";
      continue;
    }
    tagged.push({ text, origin: mode });
  }
  return tagged;
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function primaryButtonStyle(disabled: boolean): CSSProperties {
  return {
    minHeight: 52,
    width: "100%",
    padding: "14px 16px",
    border: "none",
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    background: "var(--brand)",
    color: "var(--onBrand)",
    fontFamily: "inherit",
    opacity: disabled ? 0.45 : 1,
  };
}
