// Mirrors backend/src/model/*.go — field names and shapes must match the
// JSON the Go API actually returns.

export type SubmissionSource = "photo_flowchart" | "code";

export interface GradingResult {
  score: number;
  transcript: string[];
  structure: string;
  logic_issues: string[];
  suggestions: string[];
}

export interface Submission {
  id: string;
  student_name: string;
  source: SubmissionSource;
  image_name?: string;
  image_url?: string;
  language?: string;
  result: GradingResult;
  created_at: string;
}

export interface CodeArtifact {
  submission_id: string;
  language: string;
  code: string;
  notes: string[];
}

export interface AlignmentResult {
  submission_id: string;
  alignment_score: number;
  matches: string[];
  deviations: string[];
  suggestions: string[];
}

export interface RemedialPlan {
  submission_id: string;
  focus_topics: string[];
  modules: string[];
  practice_task: string;
}

export interface ParentMessage {
  submission_id: string;
  subject: string;
  body: string;
}

export interface ClassQueryAnswer {
  question: string;
  answer: string;
  students_cited: string[];
  submissions_ref: string[];
}

export interface ListGradingsResponse {
  data: Submission[];
}

export interface ApiErrorBody {
  error?: string;
}

export type Tab = "grade" | "result" | "code" | "history" | "class";

export type ScoreBandLabel = "Good" | "Needs Work" | "Poor";

export interface ScoreBand {
  label: ScoreBandLabel;
  color: string;
}

export interface TaggedCodeLine {
  text: string;
  origin: "siswa" | "ai";
}

export interface DrawerContent {
  title: string;
  subtitle: string;
  body?: string;
  note?: string;
  cta?: string;
  loading?: boolean;
  error?: string;
}
