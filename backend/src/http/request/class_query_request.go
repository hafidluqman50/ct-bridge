package request

// ClassQueryRequest is a teacher's natural-language question over class data.
type ClassQueryRequest struct {
	Question string `json:"question" binding:"required"`
}
