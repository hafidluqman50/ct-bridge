// Package analytics answers natural-language questions over the whole set of
// stored submissions (ClassMetrics), e.g. "siswa mana yang belum paham
// percabangan?". It feeds every submission's grading result as context and
// asks the model to cite which students/submissions support its answer.
package analytics

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
    "answer": { "type": "string" },
    "students_cited": { "type": "array", "items": { "type": "string" } },
    "submissions_ref": { "type": "array", "items": { "type": "string" } }
  },
  "required": ["answer", "students_cited", "submissions_ref"]
}`)

type AnalyticsService struct {
	Gemini *external.GeminiService
	Repo   *repository.SubmissionRepository
}

// Ask answers a teacher's natural-language question about the class using
// every stored submission as context.
func (s *AnalyticsService) Ask(ctx context.Context, question string) (model.ClassQueryAnswer, error) {
	submissions := s.Repo.List()
	if len(submissions) == 0 {
		return model.ClassQueryAnswer{
			Question: question,
			Answer:   "Belum ada data penilaian siswa untuk dianalisis.",
		}, nil
	}

	prompt := fmt.Sprintf(`Kamu adalah asisten analitik kelas untuk guru Informatika.
Berikut data hasil penilaian seluruh siswa (format: submission_id | nama | sumber | skor | struktur | masalah_logika):
%s

Pertanyaan guru: "%s"

Jawab dalam Bahasa Indonesia berdasarkan data di atas SAJA (jangan mengarang data yang tidak ada):
- answer: jawaban ringkas dan jelas.
- students_cited: nama siswa yang relevan dengan jawaban.
- submissions_ref: submission_id yang menjadi bukti/dasar jawaban.`,
		formatSubmissions(submissions), question)

	raw, err := s.Gemini.GenerateJSON(ctx, prompt, responseSchema)
	if err != nil {
		return model.ClassQueryAnswer{}, fmt.Errorf("ask class analytics: %w", err)
	}

	var answer model.ClassQueryAnswer
	if err := json.Unmarshal(raw, &answer); err != nil {
		return model.ClassQueryAnswer{}, fmt.Errorf("parse class analytics answer: %w", err)
	}
	answer.Question = question
	return answer, nil
}

func formatSubmissions(submissions []model.Submission) string {
	var rows strings.Builder
	for _, sub := range submissions {
		fmt.Fprintf(&rows, "%s | %s | %s | %d | %s | %s\n",
			sub.ID, sub.StudentName, sub.Source, sub.Result.Score, sub.Result.Structure,
			strings.Join(sub.Result.LogicIssues, "; "))
	}
	return rows.String()
}
