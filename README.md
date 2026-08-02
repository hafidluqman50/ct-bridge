# CT-Bridge

Computational Thinking Bridge — menilai logika algoritma (flowchart/pseudocode)
tulisan tangan siswa dari **foto**, untuk sekolah tanpa komputer. Guru memotret
kertas, sistem membaca logikanya dengan AI vision, memberi skor + feedback, lalu
memicu aksi (remedial/notifikasi).

## Struktur (monorepo)

```
ct-bridge/
├── backend/     # Go — API, agentic loop, integrasi AI vision (Gemini)
│   └── cmd/
│       └── visiontest/   # probe go/no-go: foto -> Gemini -> ekstraksi logika
└── frontend/    # Next.js (menyusul) — UI guru: upload foto, lihat nilai
```

## Status

Tahap validasi: membuktikan AI vision bisa membaca flowchart tulisan tangan
(`backend/cmd/visiontest`). Setelah terbukti, lanjut ke API + agentic loop + FE.

## Menjalankan probe validasi

```bash
cd backend
cp .env.example .env          # lalu isi GEMINI_API_KEY (dari aistudio.google.com)
go run ./cmd/visiontest -img ~/flowchart_test.jpg
# pilih model: -model gemini-2.5-pro (atau model terbaru yang tersedia)
```
