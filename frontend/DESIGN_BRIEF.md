# CT-Bridge — Design Brief (untuk Claude Design)

## Produk (1 kalimat)
Web app yang menilai logika algoritma (flowchart/pseudocode) **tulisan tangan** siswa dari **foto** — untuk sekolah tanpa komputer. Guru foto kertas → AI baca logikanya → skor + feedback → aksi tindak lanjut.

## Pengguna utama
**Guru Informatika / wali kelas** di sekolah dengan sumber daya terbatas. Sering pakai **HP** (bukan laptop). Bukan orang teknis. Butuh: cepat, jelas, sedikit teks, ramah, tidak membebani.

## Nada & prinsip desain
- **Tenang & terpercaya** (konteks pendidikan) — bukan "startup flashy".
- **Low cognitive load**: hierarki jelas, satu aksi utama per layar.
- **Mobile-first** (guru motret pakai HP), tetap enak di desktop.
- **Ramah perangkat low-end**: ringan, tidak berat animasi.
- **Aksesibel**: kontras cukup, teks terbaca, tombol besar.
- Bahasa UI: **Indonesia**.

## Layar yang dibutuhkan

### 1. Upload / Grade
- Area upload foto besar (drag-drop di desktop, tcombol kamera/galeri di HP).
- Field "Nama siswa" (opsional).
- Preview foto sebelum submit.
- Tombol utama: **"Nilai Sekarang"**. State loading saat AI memproses (beberapa detik).

### 2. Hasil Penilaian (layar inti)
Menampilkan data nyata dari API (`POST /api/v1/gradings`):
- **Skor** besar + label status warna (mis. 🟢 Baik / 🟡 Perlu perbaikan / 🔴 Kurang).
- **Transkrip**: daftar langkah/blok yang terbaca (list bernomor).
- **Struktur**: badge (sequence / branching / loop).
- **Masalah logika** (`logic_issues`): list dengan ikon peringatan.
- **Saran** (`suggestions`): list dengan ikon lampu/ide.
- Thumbnail foto asli (bisa di-zoom).
- **Aksi agentic** (2 tombol): "Kirim modul remedial" & "Notif wali".

### 3. Riwayat (list submissions)
- Tabel/kartu daftar penilaian: nama siswa, skor, tanggal, struktur.
- Klik → buka layar Hasil.

## Bentuk data (JSON nyata dari backend)
```json
{
  "student_name": "Siswa A",
  "image_name": "flowchart.jpg",
  "result": {
    "score": 55,
    "transcript": ["START", "Input: Beras, air", "cuci beras 2x", "isi tempat masak"],
    "structure": "sequence",
    "logic_issues": ["Flowchart terpotong", "Belum ada proses memasak", "Tidak ada END"],
    "suggestions": ["Tambahkan langkah memasak", "Tutup dengan END"]
  },
  "created_at": "2026-07-19T14:00:59Z"
}
```

## Teknis (batasan implementasi)
- Frontend: **Next.js** (React). Komponen bersih, reusable.
- Konsumsi REST API di atas. Handle state: idle / uploading / grading / result / error.

## Jangan
- Jangan ramai warna / gradien norak.
- Jangan sembunyikan aksi utama.
- Jangan desain yang butuh layar lebar (harus jalan di HP).
- Jangan pakai istilah teknis yang bikin guru bingung.
```
