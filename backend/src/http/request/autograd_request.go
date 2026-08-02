package request

// AlignmentCheckRequest is the payload for checking whether a student's own
// code matches the logic they drew on their own flowchart submission.
type AlignmentCheckRequest struct {
	Code string `json:"code" binding:"required"`
}

// GenerateCodeRequest is the payload for generating runnable code from a
// graded flowchart submission's extracted logic.
type GenerateCodeRequest struct {
	Language string `json:"language" binding:"required"`
}
