"use client";

import type { DrawerContent } from "../lib/types";

interface DrawerProps {
  drawer: DrawerContent | null;
  onClose: () => void;
}

export default function Drawer({ drawer, onClose }: DrawerProps) {
  if (!drawer) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,20,18,.5)",
        zIndex: 40,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 640,
          background: "var(--card)",
          borderTop: "1px solid var(--line)",
          borderRadius: "16px 16px 0 0",
          padding: 20,
          maxHeight: "85vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 40,
            height: 4,
            borderRadius: 9999,
            background: "var(--line)",
            alignSelf: "center",
          }}
        />
        <div>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: 20,
              letterSpacing: "-.5px",
              margin: "0 0 4px",
            }}
          >
            {drawer.title}
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: "var(--mut)" }}>{drawer.subtitle}</p>
        </div>

        {drawer.loading ? (
          <div style={{ fontSize: 14, color: "var(--mut)" }}>Menyiapkan draf...</div>
        ) : drawer.error ? (
          <div style={{ fontSize: 14, color: "var(--dang)" }}>{drawer.error}</div>
        ) : (
          <div
            style={{
              background: "var(--tint2)",
              border: "1px solid var(--line)",
              borderRadius: 12,
              padding: 16,
              fontSize: 15,
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
              color: "var(--ink)",
            }}
          >
            {drawer.body}
          </div>
        )}

        <p style={{ margin: 0, fontSize: 12, color: "var(--mut)" }}>{drawer.note}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            onClick={onClose}
            style={{
              minHeight: 48,
              width: "100%",
              padding: "12px 16px",
              border: "none",
              background: "var(--brand)",
              color: "var(--onBrand)",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {drawer.cta}
          </button>
          <button
            onClick={onClose}
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
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
