package model

import "time"

// GradingResult is the structured evaluation the AI produces for one piece of
// student work. JSON keys are English; the string values themselves are in
// Indonesian because they are shown to teachers.
type GradingResult struct {
	Score       int      `json:"score"`        // 0-100
	Transcript  []string `json:"transcript"`   // step/block, top to bottom
	Structure   string   `json:"structure"`    // sequence / branching / loop
	LogicIssues []string `json:"logic_issues"` // missing or illogical steps
	Suggestions []string `json:"suggestions"`  // teaching suggestions
}

// Source distinguishes how the student work was submitted.
type Source string

const (
	SourcePhotoFlowchart Source = "photo_flowchart"
	SourceCode           Source = "code"
)

// Submission is one graded piece of student work, either a photographed
// handwritten flowchart or a code snippet.
type Submission struct {
	ID          string        `json:"id" gorm:"primaryKey"`
	StudentName string        `json:"student_name"`
	Source      Source        `json:"source"`
	ImageName   string        `json:"image_name,omitempty"`
	ImageURL    string        `json:"image_url,omitempty"` // public URL in Supabase Storage, set when Source == SourcePhotoFlowchart
	Language    string        `json:"language,omitempty"`  // set when Source == SourceCode
	Result      GradingResult `json:"result" gorm:"type:jsonb;serializer:json"`
	CreatedAt   time.Time     `json:"created_at"`
}
