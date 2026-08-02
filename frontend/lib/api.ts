import type {
  AlignmentResult,
  ApiErrorBody,
  ClassQueryAnswer,
  CodeArtifact,
  ListGradingsResponse,
  ParentMessage,
  RemedialPlan,
  Submission,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

async function handle<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const errorBody = body as ApiErrorBody | null;
    throw new Error(errorBody?.error || `Request failed (HTTP ${res.status})`);
  }
  return body as T;
}

/** Upload a flowchart photo and grade it. */
export async function gradeFlowchart(file: File, studentName: string): Promise<Submission> {
  const form = new FormData();
  form.append("image", file);
  if (studentName) form.append("student_name", studentName);
  const res = await fetch(`${BASE_URL}/gradings`, { method: "POST", body: form });
  return handle<Submission>(res);
}

/** List all graded submissions. */
export async function listGradings(): Promise<ListGradingsResponse> {
  const res = await fetch(`${BASE_URL}/gradings`);
  return handle<ListGradingsResponse>(res);
}

/** Get one submission by id. */
export async function getGrading(id: string): Promise<Submission> {
  const res = await fetch(`${BASE_URL}/gradings/${id}`);
  return handle<Submission>(res);
}

/** Generate runnable code from a graded flowchart's extracted logic. */
export async function generateCode(id: string, language = "python"): Promise<CodeArtifact> {
  const res = await fetch(`${BASE_URL}/gradings/${id}/generate-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language }),
  });
  return handle<CodeArtifact>(res);
}

/** Check whether the student's own code matches their own flowchart's logic. */
export async function checkAlignment(id: string, code: string): Promise<AlignmentResult> {
  const res = await fetch(`${BASE_URL}/gradings/${id}/code-alignment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  return handle<AlignmentResult>(res);
}

/** Get an AI-drafted remedial teaching plan for a submission. */
export async function getRemedialPlan(id: string): Promise<RemedialPlan> {
  const res = await fetch(`${BASE_URL}/gradings/${id}/remedial`);
  return handle<RemedialPlan>(res);
}

/** Get an AI-drafted guardian notification for a submission. */
export async function getParentMessage(id: string): Promise<ParentMessage> {
  const res = await fetch(`${BASE_URL}/gradings/${id}/parent-message`);
  return handle<ParentMessage>(res);
}

/** Ask a natural-language question over all stored submissions. */
export async function askClass(question: string): Promise<ClassQueryAnswer> {
  const res = await fetch(`${BASE_URL}/class-queries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  return handle<ClassQueryAnswer>(res);
}
