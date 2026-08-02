// Package grading holds the core domain logic: turn a photo of a student's
// handwritten flowchart into a structured, graded result. All reasoning lives
// here; the repository only stores and the Gemini service only calls the model.
package grading

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"time"

	"github.com/google/uuid"

	"github.com/hafidluqman/ct-bridge/backend/src/model"
	"github.com/hafidluqman/ct-bridge/backend/src/repository"
	"github.com/hafidluqman/ct-bridge/backend/src/service/external"
)

const gradingPrompt = `Kamu adalah asisten guru Informatika yang menilai kerja computational thinking siswa dari foto flowchart/pseudocode tulisan tangan.
Analisis gambar, lalu isi hasilnya. Semua teks WAJIB Bahasa Indonesia:
- score: nilai 0-100 berdasarkan kelengkapan & kebenaran logika.
- transcript: daftar tiap langkah/blok dari atas ke bawah.
- structure: "sequence", "branching", atau "loop" (boleh gabungan).
- logic_issues: langkah yang hilang, salah, atau tidak logis. Kosongkan jika tidak ada.
- suggestions: saran perbaikan yang membangun untuk siswa.
Jika ada bagian gambar yang tidak terbaca (blur/terpotong), sebutkan di logic_issues.`

// responseSchema forces Gemini to answer as JSON matching model.GradingResult.
var responseSchema = json.RawMessage(`{
  "type": "object",
  "properties": {
    "score": { "type": "integer" },
    "transcript": { "type": "array", "items": { "type": "string" } },
    "structure": { "type": "string" },
    "logic_issues": { "type": "array", "items": { "type": "string" } },
    "suggestions": { "type": "array", "items": { "type": "string" } }
  },
  "required": ["score", "transcript", "structure", "logic_issues", "suggestions"]
}`)

type GradingService struct {
	Gemini  *external.GeminiService
	Storage *external.StorageService
	Repo    *repository.SubmissionRepository
}

// Grade sends the image to the model, stores the graded submission, and returns it.
func (s *GradingService) Grade(ctx context.Context, studentName, imageName string, image []byte, mimeType string) (model.Submission, error) {
	raw, err := s.Gemini.GenerateJSONFromImage(ctx, gradingPrompt, image, mimeType, responseSchema)
	if err != nil {
		return model.Submission{}, fmt.Errorf("grade image: %w", err)
	}

	var result model.GradingResult
	if err := json.Unmarshal(raw, &result); err != nil {
		return model.Submission{}, fmt.Errorf("parse grading result: %w", err)
	}

	submission := model.Submission{
		ID:          uuid.NewString(),
		StudentName: studentName,
		Source:      model.SourcePhotoFlowchart,
		ImageName:   imageName,
		Result:      result,
		CreatedAt:   time.Now().UTC(),
	}

	// Photo storage is best-effort: a failed upload should not lose the
	// grading itself, since the grading already succeeded. The submission is
	// simply saved without an ImageURL (History falls back to no thumbnail).
	if s.Storage != nil {
		key := fmt.Sprintf("flowcharts/%s.jpg", submission.ID)
		url, uploadErr := s.Storage.Upload(ctx, key, image, mimeType)
		if uploadErr != nil {
			slog.Warn("upload flowchart photo failed", "submission_id", submission.ID, "error", uploadErr)
		} else {
			submission.ImageURL = url
		}
	}

	if err := s.Repo.Save(submission); err != nil {
		return model.Submission{}, fmt.Errorf("save submission: %w", err)
	}
	return submission, nil
}

// List returns all graded submissions.
func (s *GradingService) List() []model.Submission {
	return s.Repo.List()
}

// Get returns a single submission by id.
func (s *GradingService) Get(id string) (model.Submission, bool) {
	return s.Repo.FindByID(id)
}
