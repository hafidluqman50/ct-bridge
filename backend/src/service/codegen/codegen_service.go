// Package codegen turns a graded flowchart's extracted logic into real,
// runnable code. This is the literal "unplugged -> plugged" bridge: a photo
// of paper becomes working code, filling gaps the grading already flagged.
package codegen

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
    "code": { "type": "string" },
    "notes": { "type": "array", "items": { "type": "string" } }
  },
  "required": ["code", "notes"]
}`)

type CodegenService struct {
	Gemini *external.GeminiService
	Repo   *repository.SubmissionRepository
}

// Generate produces runnable code implementing the logic extracted from a
// graded flowchart submission, in the given target language.
func (s *CodegenService) Generate(ctx context.Context, submissionID, language string) (model.CodeArtifact, error) {
	submission, ok := s.Repo.FindByID(submissionID)
	if !ok {
		return model.CodeArtifact{}, fmt.Errorf("submission %s tidak ditemukan", submissionID)
	}
	if submission.Source != model.SourcePhotoFlowchart {
		return model.CodeArtifact{}, fmt.Errorf("submission %s bukan flowchart, tidak bisa digenerate jadi kode", submissionID)
	}

	prompt := fmt.Sprintf(`Kamu adalah asisten guru Informatika. Seorang siswa menggambar flowchart di kertas dengan logika berikut (hasil ekstraksi):
- Transkrip langkah: %s
- Struktur: %s
- Masalah/kekurangan yang ditemukan: %s

Tulis kode %s YANG BENAR-BENAR BISA DIJALANKAN yang mengimplementasikan MAKSUD flowchart ini secara utuh:
- Ikuti logika yang digambar siswa selama itu benar.
- Lengkapi/perbaiki bagian yang menurut masalah di atas hilang atau tidak logis (misal langkah yang belum ditulis, tidak ada blok akhir, dsb).
- code: kode lengkap, siap dijalankan. WAJIB tandai setiap bagian dengan komentar penanda PERSIS format berikut (jangan diubah kata-katanya, ini dipakai sistem untuk parsing otomatis):
    # ===SISWA===
    (baris kode yang berasal dari gambar siswa)
    # ===AI===
    (baris kode yang dilengkapi/diperbaiki AI)
  Boleh bolak-balik beberapa kali sesuai kebutuhan, tapi markernya harus PERSIS "# ===SISWA===" atau "# ===AI===" di baris tersendiri.
- notes: daftar singkat (Bahasa Indonesia) apa saja yang AI lengkapi/perbaiki dibanding gambar asli siswa.`,
		strings.Join(submission.Result.Transcript, " -> "), submission.Result.Structure,
		strings.Join(submission.Result.LogicIssues, "; "), language)

	raw, err := s.Gemini.GenerateJSON(ctx, prompt, responseSchema)
	if err != nil {
		return model.CodeArtifact{}, fmt.Errorf("generate code from flowchart: %w", err)
	}

	var artifact model.CodeArtifact
	if err := json.Unmarshal(raw, &artifact); err != nil {
		return model.CodeArtifact{}, fmt.Errorf("parse code artifact: %w", err)
	}
	artifact.SubmissionID = submissionID
	artifact.Language = language
	return artifact, nil
}
