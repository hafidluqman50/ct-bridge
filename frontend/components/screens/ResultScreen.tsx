"use client";

import type { CSSProperties } from "react";
import { scoreBand } from "../../lib/helpers";
import type { Submission } from "../../lib/types";

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
  color: "var(--ink)",
};

interface ResultScreenProps {
  submission: Submission | null;
  photoPreviewUrl: string | null;
  onBack: () => void;
  onGenerateCode: () => void;
  onOpenRemedial: () => void;
  onOpenGuardian: () => void;
}

export default function ResultScreen({
  submission,
  photoPreviewUrl,
  onBack,
  onGenerateCode,
  onOpenRemedial,
  onOpenGuardian,
}: ResultScreenProps) {
  if (!submission) return null;
  const { student_name, result } = submission;
  const band = scoreBand(result.score);
  // Prefer the permanent Supabase Storage URL; the client-side blob URL is
  // only a fallback for the brief moment right after upload before the
  // backend response (which already includes image_url) has been used.
  const imageUrl = submission.image_url || photoPreviewUrl;

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <button
        onClick={onBack}
        style={{
          alignSelf: "flex-start",
          minHeight: 44,
          padding: "10px 12px",
          marginLeft: -12,
          border: "none",
          background: "transparent",
          color: "var(--brand)",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          borderRadius: 12,
        }}
      >
        Back to Grade
      </button>

      <div style={{ ...cardStyle, boxShadow: "var(--shadow)" }}>
        <p style={{ margin: "0 0 2px", fontSize: 13, color: "var(--mut)" }}>Grading result</p>
        <h1
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: "-.5px",
            margin: "0 0 20px",
          }}
        >
          {student_name}
        </h1>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 64,
                  lineHeight: 0.9,
                  letterSpacing: "-2.5px",
                  color: "var(--ink)",
                }}
              >
                {result.score}
              </span>
              <span style={{ fontSize: 16, color: "var(--mut)", fontWeight: 500 }}>/100</span>
            </div>
            <p style={{ margin: "8px 0 0", fontSize: 14, fontWeight: 600, color: band.color }}>
              {band.label}
            </p>
          </div>
          <div
            style={{
              flex: 1,
              minWidth: 140,
              display: "flex",
              flexDirection: "column",
              gap: 6,
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: 12, color: "var(--mut)" }}>Structure detected</span>
            <span
              style={{
                display: "inline-block",
                padding: "6px 12px",
                borderRadius: 9999,
                background: "var(--tint)",
                border: "1px solid var(--line)",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--ink)",
              }}
            >
              {result.structure}
            </span>
          </div>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 12,
              background: "var(--tint2)",
              border: "1px solid var(--line)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              color: "var(--mut)",
              textAlign: "center",
              lineHeight: 1.2,
              overflow: "hidden",
            }}
          >
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt="Original flowchart"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              "Original photo"
            )}
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <h2
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 15,
            fontWeight: 600,
            margin: "0 0 12px",
            letterSpacing: "-.2px",
          }}
        >
          Transcript
        </h2>
        <ol
          style={{
            margin: 0,
            paddingLeft: 20,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            fontSize: 15,
            color: "var(--ink)",
          }}
        >
          {result.transcript.map((line, i) => (
            <li key={i} style={{ paddingLeft: 4 }}>
              {line}
            </li>
          ))}
        </ol>
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
          Issues found
        </h2>
        <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--warn)", fontWeight: 600 }}>
          Needs Work · {result.logic_issues.length} findings
        </p>
        <ul
          style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}
        >
          {result.logic_issues.map((it, i) => (
            <li key={i} style={listItemStyle}>
              {it}
            </li>
          ))}
        </ul>
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
          Suggested improvements
        </h2>
        <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--info)", fontWeight: 600 }}>
          For the teacher
        </p>
        <ul
          style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}
        >
          {result.suggestions.map((s, i) => (
            <li key={i} style={listItemStyle}>
              {s}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <p style={{ margin: "0 0 4px", fontSize: 13, color: "var(--mut)", fontWeight: 500 }}>
          Follow-up — review every draft before it is sent
        </p>
        <button
          onClick={onGenerateCode}
          style={{
            minHeight: 48,
            padding: "12px 16px",
            border: "1px solid var(--brand)",
            background: "transparent",
            color: "var(--brand)",
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          Generate Code
        </button>
        <button
          onClick={onOpenRemedial}
          style={{
            minHeight: 48,
            padding: "12px 16px",
            border: "1px solid var(--line)",
            background: "var(--card)",
            color: "var(--ink)",
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 500,
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          Send Remedial Module
        </button>
        <button
          onClick={onOpenGuardian}
          style={{
            minHeight: 48,
            padding: "12px 16px",
            border: "1px solid var(--line)",
            background: "var(--card)",
            color: "var(--ink)",
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 500,
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          Notify Guardian
        </button>
      </div>
    </section>
  );
}
