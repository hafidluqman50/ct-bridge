"use client";

import { useRef } from "react";
import { primaryButtonStyle } from "../../lib/helpers";

interface GradeScreenProps {
  photoFile: File | null;
  photoPreviewUrl: string | null;
  onPickPhoto: (file: File) => void;
  onRemovePhoto: () => void;
  studentName: string;
  onStudentNameChange: (value: string) => void;
  grading: boolean;
  onGrade: () => void;
  error: string | null;
}

export default function GradeScreen({
  photoFile,
  photoPreviewUrl,
  onPickPhoto,
  onRemovePhoto,
  studentName,
  onStudentNameChange,
  grading,
  onGrade,
  error,
}: GradeScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onPickPhoto(file);
  }

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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
          Grade a flowchart
        </h1>
        <p style={{ margin: 0, color: "var(--mut)", fontSize: 15, maxWidth: "52ch" }}>
          Photograph the flowchart your student drew on paper. One photo, one student.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {!photoFile ? (
        <div
          style={{
            background: "var(--card)",
            border: "1px dashed var(--line)",
            borderRadius: 16,
            padding: "32px 20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "var(--tint)",
              border: "1px solid var(--line)",
            }}
          />
          <div>
            <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: 16 }}>
              Add a flowchart photo
            </p>
            <p style={{ margin: 0, color: "var(--mut)", fontSize: 13 }}>
              Tap to use the camera, or drag a file here on desktop
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              width: "100%",
              maxWidth: 320,
            }}
          >
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                minHeight: 48,
                width: "100%",
                padding: "12px 16px",
                border: "1px solid var(--brand)",
                background: "transparent",
                color: "var(--brand)",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Take Photo
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                minHeight: 48,
                width: "100%",
                padding: "12px 16px",
                border: "1px solid var(--line)",
                background: "transparent",
                color: "var(--mut)",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Choose from Gallery
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--line)",
            borderRadius: 16,
            padding: 16,
            boxShadow: "var(--shadow)",
          }}
        >
          <div
            style={{
              height: 200,
              borderRadius: 12,
              background: "var(--tint2)",
              border: "1px solid var(--line)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--mut)",
              fontSize: 13,
              overflow: "hidden",
            }}
          >
            {photoPreviewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoPreviewUrl}
                alt="Flowchart preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              "Flowchart photo preview"
            )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginTop: 12,
            }}
          >
            <span
              style={{
                fontSize: 13,
                color: "var(--mut)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {photoFile.name} · {(photoFile.size / (1024 * 1024)).toFixed(1)} MB
            </span>
            <button
              onClick={onRemovePhoto}
              style={{
                minHeight: 44,
                padding: "10px 12px",
                border: "none",
                background: "transparent",
                color: "var(--brand)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                borderRadius: 12,
              }}
            >
              Replace photo
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: 16,
          padding: 16,
        }}
      >
        <label
          htmlFor="ctb-student-name"
          style={{
            display: "block",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--ink)",
            marginBottom: 6,
          }}
        >
          Student name <span style={{ color: "var(--mut)", fontWeight: 400 }}>(optional)</span>
        </label>
        <input
          id="ctb-student-name"
          placeholder="e.g. Aisyah Nur Rahmawati"
          value={studentName}
          onChange={(e) => onStudentNameChange(e.target.value)}
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
      </div>

      {error && <p style={{ margin: 0, color: "var(--dang)", fontSize: 14 }}>{error}</p>}

      <button
        onClick={onGrade}
        disabled={!photoFile || grading}
        style={primaryButtonStyle(!photoFile || grading)}
      >
        {grading ? "Analyzing flowchart..." : "Grade Now"}
      </button>
      <p style={{ margin: 0, textAlign: "center", fontSize: 12, color: "var(--mut)" }}>
        Analysis usually finishes in 10–20 seconds.
      </p>
    </section>
  );
}
