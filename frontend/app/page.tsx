"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import Drawer from "../components/Drawer";
import GradeScreen from "../components/screens/GradeScreen";
import ResultScreen from "../components/screens/ResultScreen";
import CodeScreen from "../components/screens/CodeScreen";
import HistoryScreen from "../components/screens/HistoryScreen";
import ClassScreen from "../components/screens/ClassScreen";
import {
  gradeFlowchart,
  listGradings,
  generateCode,
  checkAlignment,
  getRemedialPlan,
  getParentMessage,
  askClass,
} from "../lib/api";
import type {
  AlignmentResult,
  ClassQueryAnswer,
  CodeArtifact,
  DrawerContent,
  Submission,
  Tab,
} from "../lib/types";

export default function Page() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [tab, setTab] = useState<Tab>("grade");

  // Grade (upload) state
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [studentName, setStudentName] = useState("");
  const [grading, setGrading] = useState(false);
  const [gradingError, setGradingError] = useState<string | null>(null);

  // Current graded submission (drives Result + Code screens)
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [previewsById, setPreviewsById] = useState<Record<string, string | null>>({});

  // Code (codegen + alignment) state
  const [codeArtifact, setCodeArtifact] = useState<CodeArtifact | null>(null);
  const [codegenLoading, setCodegenLoading] = useState(false);
  const [codegenError, setCodegenError] = useState<string | null>(null);
  const [studentCode, setStudentCode] = useState("");
  const [aligning, setAligning] = useState(false);
  const [alignment, setAlignment] = useState<AlignmentResult | null>(null);
  const [alignmentError, setAlignmentError] = useState<string | null>(null);

  // History state
  const [history, setHistory] = useState<Submission[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  // Class state
  const [query, setQuery] = useState("");
  const [asking, setAsking] = useState(false);
  const [answer, setAnswer] = useState<ClassQueryAnswer | null>(null);
  const [askError, setAskError] = useState<string | null>(null);

  // Drawer (Remedial / Guardian)
  const [drawer, setDrawer] = useState<DrawerContent | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-ctb", theme);
  }, [theme]);

  useEffect(() => {
    if (tab === "history") loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  async function loadHistory() {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const res = await listGradings();
      setHistory(res.data || []);
    } catch (err) {
      setHistoryError(err instanceof Error ? err.message : String(err));
    } finally {
      setHistoryLoading(false);
    }
  }

  function handlePickPhoto(file: File) {
    setPhotoFile(file);
    setGradingError(null);
    const url = URL.createObjectURL(file);
    setPhotoPreviewUrl(url);
  }

  function handleRemovePhoto() {
    setPhotoFile(null);
    setPhotoPreviewUrl(null);
  }

  async function handleGrade() {
    if (!photoFile) return;
    setGrading(true);
    setGradingError(null);
    try {
      const graded = await gradeFlowchart(photoFile, studentName);
      setSubmission(graded);
      setPreviewsById((prev) => ({ ...prev, [graded.id]: photoPreviewUrl }));
      setCodeArtifact(null);
      setAlignment(null);
      setTab("result");
    } catch (err) {
      setGradingError(err instanceof Error ? err.message : String(err));
    } finally {
      setGrading(false);
    }
  }

  async function handleGenerateCode() {
    if (!submission) return;
    setTab("code");
    setCodegenLoading(true);
    setCodegenError(null);
    setCodeArtifact(null);
    setAlignment(null);
    try {
      const artifact = await generateCode(submission.id, "python");
      setCodeArtifact(artifact);
    } catch (err) {
      setCodegenError(err instanceof Error ? err.message : String(err));
    } finally {
      setCodegenLoading(false);
    }
  }

  async function handleRunAlignment() {
    if (!submission || !studentCode.trim()) return;
    setAligning(true);
    setAlignmentError(null);
    try {
      const result = await checkAlignment(submission.id, studentCode);
      setAlignment(result);
    } catch (err) {
      setAlignmentError(err instanceof Error ? err.message : String(err));
    } finally {
      setAligning(false);
    }
  }

  async function handleOpenRemedial() {
    if (!submission) return;
    const subtitle = `For ${submission.student_name} · ${submission.result.structure}`;
    setDrawer({ title: "Remedial module — AI draft", subtitle, loading: true });
    try {
      const plan = await getRemedialPlan(submission.id);
      setDrawer({
        title: "Remedial module — AI draft",
        subtitle,
        body: [
          `Fokus: ${plan.focus_topics.join(", ")}`,
          "",
          "Modul:",
          ...plan.modules.map((m) => `- ${m}`),
          "",
          `Latihan: ${plan.practice_task}`,
        ].join("\n"),
        note: "Review and edit this draft before sending. The module is delivered as a printable worksheet.",
        cta: "Send remedial module",
      });
    } catch (err) {
      setDrawer({
        title: "Remedial module — AI draft",
        subtitle,
        error: err instanceof Error ? err.message : String(err),
        cta: "Close",
      });
    }
  }

  async function handleOpenGuardian() {
    if (!submission) return;
    const subtitle = `For ${submission.student_name}'s guardian`;
    setDrawer({ title: "Guardian notification — AI draft", subtitle, loading: true });
    try {
      const message = await getParentMessage(submission.id);
      setDrawer({
        title: "Guardian notification — AI draft",
        subtitle,
        body: `${message.subject}\n\n${message.body}`,
        note: "The tone is kept neutral and non-judgemental. You can edit it before sending.",
        cta: "Send to guardian",
      });
    } catch (err) {
      setDrawer({
        title: "Guardian notification — AI draft",
        subtitle,
        error: err instanceof Error ? err.message : String(err),
        cta: "Close",
      });
    }
  }

  async function handleAsk() {
    if (!query.trim()) return;
    setAsking(true);
    setAskError(null);
    try {
      const res = await askClass(query);
      setAnswer(res);
    } catch (err) {
      setAskError(err instanceof Error ? err.message : String(err));
    } finally {
      setAsking(false);
    }
  }

  function handleOpenHistoryItem(item: Submission) {
    setSubmission(item);
    setPhotoPreviewUrl(previewsById[item.id] || null);
    setCodeArtifact(null);
    setAlignment(null);
    setTab("result");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--ink)",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 16,
        lineHeight: 1.5,
        paddingBottom: 48,
      }}
    >
      <Header
        tab={tab}
        onTabChange={setTab}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      />

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "24px 16px 0" }}>
        {tab === "grade" && (
          <GradeScreen
            photoFile={photoFile}
            photoPreviewUrl={photoPreviewUrl}
            onPickPhoto={handlePickPhoto}
            onRemovePhoto={handleRemovePhoto}
            studentName={studentName}
            onStudentNameChange={setStudentName}
            grading={grading}
            onGrade={handleGrade}
            error={gradingError}
          />
        )}

        {tab === "result" && (
          <ResultScreen
            submission={submission}
            photoPreviewUrl={photoPreviewUrl}
            onBack={() => setTab("grade")}
            onGenerateCode={handleGenerateCode}
            onOpenRemedial={handleOpenRemedial}
            onOpenGuardian={handleOpenGuardian}
          />
        )}

        {tab === "code" && (
          <CodeScreen
            submission={submission}
            codeArtifact={codeArtifact}
            codegenLoading={codegenLoading}
            codegenError={codegenError}
            studentCode={studentCode}
            onStudentCodeChange={setStudentCode}
            aligning={aligning}
            alignment={alignment}
            alignmentError={alignmentError}
            onRunAlignment={handleRunAlignment}
          />
        )}

        {tab === "history" && (
          <HistoryScreen
            loading={historyLoading}
            error={historyError}
            history={history}
            onOpen={handleOpenHistoryItem}
          />
        )}

        {tab === "class" && (
          <ClassScreen
            query={query}
            onQueryChange={setQuery}
            onPickExample={setQuery}
            asking={asking}
            onAsk={handleAsk}
            answer={answer}
            error={askError}
            onOpenCitation={() => setTab("history")}
          />
        )}
      </main>

      <Drawer drawer={drawer} onClose={() => setDrawer(null)} />
    </div>
  );
}
