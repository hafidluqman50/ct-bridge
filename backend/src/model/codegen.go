package model

// CodeArtifact is real, runnable code the AI generates FROM a graded
// flowchart's logic — the concrete answer to "what does this flowchart
// become". It fills gaps already flagged in the flowchart's logic_issues.
type CodeArtifact struct {
	SubmissionID string   `json:"submission_id"`
	Language     string   `json:"language"`
	Code         string   `json:"code"`
	Notes        []string `json:"notes"` // what was inferred/completed vs. what was drawn
}

// AlignmentResult checks whether a student's OWN code matches the logic
// THEY THEMSELVES drew on paper for the same submission — not generic code
// quality, but paper-to-code consistency.
type AlignmentResult struct {
	SubmissionID   string   `json:"submission_id"`
	AlignmentScore int      `json:"alignment_score"` // 0-100: does code match the student's own paper logic
	Matches        []string `json:"matches"`         // logic that carried over correctly
	Deviations     []string `json:"deviations"`      // where code diverges from the paper design
	Suggestions    []string `json:"suggestions"`
}
