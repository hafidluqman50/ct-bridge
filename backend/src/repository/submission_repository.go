package repository

import (
	"gorm.io/gorm"

	"github.com/hafidluqman/ct-bridge/backend/src/model"
)

// SubmissionRepository persists graded submissions in Postgres. The public
// shape (Save/FindByID/List) is unchanged from the earlier in-memory
// implementation, so the service layer above it needed no changes.
type SubmissionRepository struct {
	DB *gorm.DB
}

func NewSubmissionRepository(db *gorm.DB) *SubmissionRepository {
	return &SubmissionRepository{DB: db}
}

func (r *SubmissionRepository) Save(submission model.Submission) error {
	return r.DB.Save(&submission).Error
}

func (r *SubmissionRepository) FindByID(id string) (model.Submission, bool) {
	var submission model.Submission
	if err := r.DB.First(&submission, "id = ?", id).Error; err != nil {
		return model.Submission{}, false
	}
	return submission, true
}

func (r *SubmissionRepository) List() []model.Submission {
	var submissions []model.Submission
	r.DB.Order("created_at DESC").Find(&submissions)
	return submissions
}
