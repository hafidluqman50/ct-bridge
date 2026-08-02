// Package autograd checks whether a student's OWN code matches the logic
// THEY THEMSELVES drew on their flowchart — not generic code quality, but
// paper-to-code alignment. This is what makes it a CT-Bridge feature and not
// a generic "paste code, get a grade" tool.
package autograd

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/hafidluqman/ct-bridge/backend/src/model"
	"github.com/hafidluqman/ct-bridge/backend/src/repository"
	"github.com/hafidluqman/ct-bridge/backend/src/service/external"
)

var responseSchema = json.RawMessage(`{
  "type": "object",
  "properties": {
    "alignment_score": { "type": "integer" },
    "matches": { "type": "array", "items": { "type": "string" } },
    "deviations": { "type": "array", "items": { "type": "string" } },
    "suggestions": { "type": "array", "items": { "type": "string" } }
  },
  "required": ["alignment_score", "matches", "deviations", "suggestions"]
}`)

type AutoGradService struct {
	Gemini *external.GeminiService
	Repo   *repository.SubmissionRepository
}

// CheckAlignment compares a student's own code against the logic they
// themselves drew on paper for the same submission.
func (s *AutoGradService) CheckAlignment(ctx context.Context, submissionID, code string) (model.AlignmentResult, error) {
	submission, ok := s.Repo.FindByID(submissionID)
	if !ok {
		return model.AlignmentResult{}, fmt.Errorf("submission %s tidak ditemukan", submissionID)
	}
	if submission.Source != model.SourcePhotoFlowchart {
		return model.AlignmentResult{}, fmt.Errorf("submission %s bukan flowchart, tidak ada logika kertas untuk dibandingkan", submissionID)
	}

	prompt := fmt.Sprintf(`Kamu adalah asisten guru Informatika. Siswa "%s" sebelumnya menggambar flowchart di kertas dengan logika berikut:
- Transkrip langkah: %s
- Struktur: %s

Sekarang siswa menulis kode berikut sebagai implementasi dari flowchart TERSEBUT:
%s

TUGAS: bandingkan kode ini dengan LOGIKA YANG DIA GAMBAR SENDIRI di kertas (bukan menilai kode secara umum).
- alignment_score: 0-100, seberapa sesuai kode dengan logika kertas aslinya.
- matches: bagian logika kertas yang berhasil diimplementasikan dengan benar di kode.
- deviations: bagian di mana kode MENYIMPANG dari logika yang dia gambar sendiri (baik lebih baik, lebih buruk, atau berbeda).
- suggestions: saran agar kode makin selaras dengan (atau memperbaiki) logika kertas aslinya.
Semua teks Bahasa Indonesia.`,
		submission.StudentName, strings.Join(submission.Result.Transcript, " -> "),
		submission.Result.Structure, code)

	raw, err := s.Gemini.GenerateJSON(ctx, prompt, responseSchema)
	if err != nil {
		return model.AlignmentResult{}, fmt.Errorf("check code alignment: %w", err)
	}

	var result model.AlignmentResult
	if err := json.Unmarshal(raw, &result); err != nil {
		return model.AlignmentResult{}, fmt.Errorf("parse alignment result: %w", err)
	}
	result.SubmissionID = submissionID
	return result, nil
}
