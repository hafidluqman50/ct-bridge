"use client";

import type { CSSProperties } from "react";
import { scoreBand, tagCodeLines, primaryButtonStyle } from "../../lib/helpers";
import type { AlignmentResult, CodeArtifact, Submission } from "../../lib/types";

const cardStyle: CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--line)",
  borderRadius: 16,
  padding: 20,
};

const listItemStyle: CSSProperties = {
  fontSize: 15,
  paddingLeft: 14,
  borderLeft: "2px solid var(--line)",
};

interface CodeScreenProps {
  submission: Submission | null;
  codeArtifact: CodeArtifact | null;
  codegenLoading: boolean;
  codegenError: string | null;
  studentCode: string;
  onStudentCodeChange: (value: string) => void;
  aligning: boolean;
  alignment: AlignmentResult | null;
  alignmentError: string | null;
  onRunAlignment: () => void;
}

export default function CodeScreen({
  submission,
  codeArtifact,
  codegenLoading,
  codegenError,
  studentCode,
  onStudentCodeChange,
  aligning,
  alignment,
  alignmentError,
  onRunAlignment,
}: CodeScreenProps) {
  if (!submission) return null;

  if (codegenLoading) {
    return (
      <section>
        <p style={{ color: "var(--mut)" }}>Generating code from the flowchart...</p>
      </section>
    );
  }

  if (codegenError) {
    return (
      <section>
        <p style={{ color: "var(--dang)" }}>{codegenError}</p>
      </section>
    );
  }

  if (!codeArtifact) return null;

  const codeLines = tagCodeLines(codeArtifact.code);
  const alignBand = alignment ? scoreBand(alignment.alignment_score) : null;

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
          Code from the flowchart
        </h1>
        <p style={{ margin: 0, color: "var(--mut)", fontSize: 15, maxWidth: "52ch" }}>
          This code runs the logic {submission.student_name} drew. Anything the AI completed is
          marked.
        </p>
      </div>

      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "var(--shadow)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "14px 16px",
            borderBottom: "1px solid var(--line)",
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "'JetBrains Mono', monospace",
              color: "var(--ink)",
            }}
          >
            generated.{codeArtifact.language === "python" ? "py" : codeArtifact.language}
          </span>
          <span style={{ fontSize: 12, color: "var(--mut)" }}>{codeArtifact.language}</span>
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            padding: "10px 16px",
            borderBottom: "1px solid var(--line)",
            flexWrap: "wrap",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--mut)" }}>
            <span style={{ width: 3, height: 14, background: "var(--brand)", display: "inline-block" }} />
            from student&apos;s drawing
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--mut)" }}>
            <span style={{ width: 3, height: 14, background: "var(--info)", display: "inline-block" }} />
            completed by AI
          </span>
        </div>
        <div
          style={{
            background: "var(--code)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            lineHeight: 1.7,
            overflowX: "auto",
          }}
        >
          {codeLines.map((ln, i) => {
            const isStudent = ln.origin === "siswa";
            const col = isStudent ? "var(--brand)" : "var(--info)";
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "baseline",
                  padding: "1px 14px 1px 0",
                  borderLeft: `3px solid ${col}`,
                  background: isStudent ? "transparent" : "var(--tint2)",
                }}
              >
                <span
                  style={{
                    width: 26,
                    flex: "none",
                    textAlign: "right",
                    color: "var(--mut)",
                    opacity: 0.6,
                    userSelect: "none",
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ whiteSpace: "pre", flex: 1, color: "var(--ink)" }}>{ln.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={cardStyle}>
        <h2
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 15,
            fontWeight: 600,
            margin: "0 0 4px",
            letterSpacing: "-.2px",
          }}
        >
          AI notes
        </h2>
        <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--info)", fontWeight: 600 }}>
          What was inferred and fixed
        </p>
        <ul
          style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}
        >
          {codeArtifact.notes.map((n, i) => (
            <li key={i} style={{ ...listItemStyle, color: "var(--ink)" }}>
              {n}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ height: 1, background: "var(--line)", margin: "8px 0" }} />

      <div>
        <h2
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: "-.5px",
            margin: "0 0 6px",
          }}
        >
          Alignment check
        </h2>
        <p style={{ margin: 0, color: "var(--mut)", fontSize: 15, maxWidth: "52ch" }}>
          Paste the code the student wrote themselves. The AI compares it against that same
          student&apos;s own flowchart — not against an answer key.
        </p>
      </div>

      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: 16,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <label htmlFor="ctb-student-code" style={{ fontSize: 13, fontWeight: 600 }}>
          Student&apos;s code
        </label>
        <textarea
          id="ctb-student-code"
          value={studentCode}
          onChange={(e) => onStudentCodeChange(e.target.value)}
          placeholder="Paste the student's code here..."
          style={{
            width: "100%",
            minHeight: 160,
            padding: "12px 14px",
            border: "1px solid var(--line)",
            borderRadius: 12,
            background: "var(--code)",
            color: "var(--ink)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            lineHeight: 1.7,
            resize: "vertical",
          }}
        />
        {alignmentError && (
          <p style={{ margin: 0, color: "var(--dang)", fontSize: 13 }}>{alignmentError}</p>
        )}
        <button
          onClick={onRunAlignment}
          disabled={aligning || !studentCode.trim()}
          style={primaryButtonStyle(aligning || !studentCode.trim())}
        >
          {aligning ? "Comparing with the flowchart..." : "Check Alignment"}
        </button>
      </div>

      {alignment && alignBand && (
        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--line)",
            borderRadius: 16,
            padding: 20,
            boxShadow: "var(--shadow)",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
            <div>
              <p style={{ margin: "0 0 6px", fontSize: 13, color: "var(--mut)" }}>Alignment score</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: 56,
                    lineHeight: 0.9,
                    letterSpacing: "-2px",
                  }}
                >
                  {alignment.alignment_score}
                </span>
                <span style={{ fontSize: 15, color: "var(--mut)", fontWeight: 500 }}>/100</span>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: alignBand.color }}>
              {alignBand.label}
            </p>
          </div>

          <div>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 600, margin: "0 0 4px" }}>
              Matches the paper logic
            </h3>
            <p style={{ margin: "0 0 10px", fontSize: 12, color: "var(--ok)", fontWeight: 600 }}>Good</p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {alignment.matches.map((m, i) => (
                <li key={i} style={listItemStyle}>
                  {m}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 600, margin: "0 0 4px" }}>
              Deviates from the paper logic
            </h3>
            <p style={{ margin: "0 0 10px", fontSize: 12, color: "var(--dang)", fontWeight: 600 }}>Poor</p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {alignment.deviations.map((d, i) => (
                <li key={i} style={listItemStyle}>
                  {d}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 600, margin: "0 0 4px" }}>
              Suggestions for the student
            </h3>
            <p style={{ margin: "0 0 10px", fontSize: 12, color: "var(--info)", fontWeight: 600 }}>Suggestion</p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {alignment.suggestions.map((s, i) => (
                <li key={i} style={listItemStyle}>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
