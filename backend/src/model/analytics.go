package model

// ClassQueryAnswer is the AI's answer to a natural-language question asked
// over the whole set of stored submissions (ClassMetrics).
type ClassQueryAnswer struct {
	Question       string   `json:"question"`
	Answer         string   `json:"answer"`
	StudentsCited  []string `json:"students_cited"`
	SubmissionsRef []string `json:"submissions_ref"` // submission IDs used as evidence
}
