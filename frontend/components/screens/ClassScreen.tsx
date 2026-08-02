"use client";

import { primaryButtonStyle } from "../../lib/helpers";
import type { ClassQueryAnswer } from "../../lib/types";

const EXAMPLES = [
  "Who needs remedial work this week?",
  "Which logic mistake shows up most often?",
  "How did the class progress this month?",
];

interface ClassScreenProps {
  query: string;
  onQueryChange: (value: string) => void;
  onPickExample: (value: string) => void;
  asking: boolean;
  onAsk: () => void;
  answer: ClassQueryAnswer | null;
  error: string | null;
  onOpenCitation?: (citation: string) => void;
}

export default function ClassScreen({
  query,
  onQueryChange,
  onPickExample,
  asking,
  onAsk,
  answer,
  error,
  onOpenCitation,
}: ClassScreenProps) {
  const cites = answer ? [...answer.students_cited, ...answer.submissions_ref] : [];

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
          Class
        </h1>
        <p style={{ margin: 0, color: "var(--mut)", fontSize: 15, maxWidth: "52ch" }}>
          Ask anything about your class in plain language.
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
        <label htmlFor="ctb-ask" style={{ fontSize: 13, fontWeight: 600 }}>
          Question
        </label>
        <input
          id="ctb-ask"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Ask about your class..."
          style={{
            width: "100%",
            minHeight: 48,
            padding: "12px 14px",
            border: "1px solid var(--line)",
            borderRadius: 12,
            background: "var(--bg)",
            color: "var(--ink)",
            fontSize: 15,
            fontFamily: "inherit",
          }}
        />
        {error && <p style={{ margin: 0, color: "var(--dang)", fontSize: 13 }}>{error}</p>}
        <button onClick={onAsk} disabled={asking || !query.trim()} style={primaryButtonStyle(asking || !query.trim())}>
          {asking ? "Finding an answer..." : "Ask"}
        </button>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {EXAMPLES.map((text) => (
            <button
              key={text}
              onClick={() => onPickExample(text)}
              style={{
                minHeight: 44,
                padding: "10px 12px",
                border: "1px solid var(--line)",
                background: "transparent",
                color: "var(--mut)",
                borderRadius: 9999,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {text}
            </button>
          ))}
        </div>
      </div>

      {answer && (
        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--line)",
            borderRadius: 16,
            padding: 20,
            boxShadow: "var(--shadow)",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div>
            <p style={{ margin: "0 0 8px", fontSize: 13, color: "var(--mut)" }}>Answer</p>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: "var(--ink)" }}>{answer.answer}</p>
          </div>
          {cites.length > 0 && (
            <div>
              <p style={{ margin: "0 0 8px", fontSize: 12, color: "var(--mut)", fontWeight: 600 }}>
                Based on these gradings
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {cites.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => onOpenCitation?.(c)}
                    style={{
                      minHeight: 44,
                      padding: "10px 12px",
                      border: "1px solid var(--line)",
                      background: "var(--tint)",
                      color: "var(--ink)",
                      borderRadius: 9999,
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
