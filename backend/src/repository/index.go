package repository

import "gorm.io/gorm"

// Registry aggregates every repository so the bootstrap layer wires them once.
type Registry struct {
	Submission *SubmissionRepository
}

func NewRegistry(db *gorm.DB) Registry {
	return Registry{
		Submission: NewSubmissionRepository(db),
	}
}
