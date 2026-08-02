package model

// RemedialPlan is a concrete, teachable follow-up for a submission that
// showed logic issues.
type RemedialPlan struct {
	SubmissionID string   `json:"submission_id"`
	FocusTopics  []string `json:"focus_topics"`  // concepts the student struggled with
	Modules      []string `json:"modules"`       // suggested teaching modules/activities
	PracticeTask string   `json:"practice_task"` // one concrete next exercise
}

// ParentMessage is a draft notification a teacher can review and send to a
// student's parent/guardian.
type ParentMessage struct {
	SubmissionID string `json:"submission_id"`
	Subject      string `json:"subject"`
	Body         string `json:"body"`
}
