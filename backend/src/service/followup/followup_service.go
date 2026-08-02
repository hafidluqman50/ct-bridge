// Package followup turns an already-graded submission into concrete next
// actions a teacher can take: a remedial teaching plan, or a draft message to
// a parent/guardian. Both reuse the submission's stored grading result as
// context instead of re-analyzing the original image.
package followup

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/hafidluqman/ct-bridge/backend/src/model"
	"github.com/hafidluqman/ct-bridge/backend/src/repository"
	"github.com/hafidluqman/ct-bridge/backend/src/service/external"
)

var remedialSchema = json.RawMessage(`{
  "type": "object",
  "properties": {
    "focus_topics": { "type": "array", "items": { "type": "string" } },
    "modules": { "type": "array", "items": { "type": "string" } },
    "practice_task": { "type": "string" }
  },
  "required": ["focus_topics", "modules", "practice_task"]
}`)

var parentMessageSchema = json.RawMessage(`{
  "type": "object",
  "properties": {
    "subject": { "type": "string" },
    "body": { "type": "string" }
  },
  "required": ["subject", "body"]
}`)

type FollowUpService struct {
	Gemini *external.GeminiService
	Repo   *repository.SubmissionRepository
}

// RemedialPlan asks the model for concrete follow-up teaching material based
// on the logic issues already found for a submission.
func (s *FollowUpService) RemedialPlan(ctx context.Context, submissionID string) (model.RemedialPlan, error) {
	submission, ok := s.Repo.FindByID(submissionID)
	if !ok {
		return model.RemedialPlan{}, fmt.Errorf("submission %s tidak ditemukan", submissionID)
	}

	prompt := fmt.Sprintf(`Kamu adalah guru Informatika yang menyusun rencana remedial untuk siswa "%s".
Hasil penilaian sebelumnya:
- Skor: %d
- Struktur: %s
- Masalah logika: %s

Susun rencana remedial dalam Bahasa Indonesia:
- focus_topics: konsep computational thinking yang perlu diperkuat.
- modules: aktivitas/modul pengajaran konkret untuk topik tersebut.
- practice_task: satu tugas latihan lanjutan yang spesifik.`,
		submission.StudentName, submission.Result.Score, submission.Result.Structure,
		strings.Join(submission.Result.LogicIssues, "; "))

	raw, err := s.Gemini.GenerateJSON(ctx, prompt, remedialSchema)
	if err != nil {
		return model.RemedialPlan{}, fmt.Errorf("generate remedial plan: %w", err)
	}

	var plan model.RemedialPlan
	if err := json.Unmarshal(raw, &plan); err != nil {
		return model.RemedialPlan{}, fmt.Errorf("parse remedial plan: %w", err)
	}
	plan.SubmissionID = submissionID
	return plan, nil
}

// ParentMessage drafts a notification a teacher can review before sending to
// a parent/guardian. It does not send anything itself.
func (s *FollowUpService) ParentMessage(ctx context.Context, submissionID string) (model.ParentMessage, error) {
	submission, ok := s.Repo.FindByID(submissionID)
	if !ok {
		return model.ParentMessage{}, fmt.Errorf("submission %s tidak ditemukan", submissionID)
	}

	prompt := fmt.Sprintf(`Kamu adalah guru Informatika yang menulis draf pesan singkat untuk orang tua/wali siswa "%s".
Hasil penilaian: skor %d/100, struktur "%s", masalah: %s.

Tulis draf pesan dalam Bahasa Indonesia yang sopan, ringkas, dan membangun (bukan menghakimi):
- subject: judul singkat pesan.
- body: isi pesan (2-4 kalimat), jelaskan progres siswa secara positif dan ajak dukungan orang tua.`,
		submission.StudentName, submission.Result.Score, submission.Result.Structure,
		strings.Join(submission.Result.LogicIssues, "; "))

	raw, err := s.Gemini.GenerateJSON(ctx, prompt, parentMessageSchema)
	if err != nil {
		return model.ParentMessage{}, fmt.Errorf("generate parent message: %w", err)
	}

	var message model.ParentMessage
	if err := json.Unmarshal(raw, &message); err != nil {
		return model.ParentMessage{}, fmt.Errorf("parse parent message: %w", err)
	}
	message.SubmissionID = submissionID
	return message, nil
}
