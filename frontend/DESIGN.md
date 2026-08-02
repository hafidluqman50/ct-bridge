# DESIGN.md — CT-Bridge

> Source of truth untuk semua keputusan visual. Agent: baca file ini SEBELUM menulis/mengubah UI. Match token, type scale, spacing, dan pola komponen di sini.
>
> Produk & layar (konteks): lihat `DESIGN_BRIEF.md`. File ini = visual language.

## 1. Visual Theme & Atmosphere
Tenang, terpercaya, edukatif — bukan "startup flashy". Terasa seperti alat bantu guru yang bersih dan ramah. Prioritas: keterbacaan, ruang napas, satu aksi utama per layar. Mobile-first (guru memotret dengan HP), ringan di perangkat low-end, aksesibel (WCAG AA).

## 2. Color Palette & Roles

### Light (default)
| Token | Hex | Peran |
|---|---|---|
| `bg` | `#F8FAF9` | Latar halaman (off-white hangat) |
| `surface` | `#FFFFFF` | Kartu, panel |
| `border` | `#E2E8E6` | Garis pemisah, outline input |
| `text` | `#14201E` | Teks utama |
| `text-muted` | `#52655F` | Teks sekunder, caption |
| `primary` | `#0F766E` | Brand, tombol utama, link |
| `primary-hover` | `#0B5D57` | State hover tombol utama |
| `on-primary` | `#FFFFFF` | Teks di atas primary |
| `primary-soft` | `#ECFDF5` | Latar highlight lembut, badge |
| `success` | `#15803D` | Skor baik (🟢), konfirmasi |
| `warning` | `#B45309` | Skor perlu perbaikan (🟡), isu logika |
| `danger` | `#B91C1C` | Skor kurang (🔴), error |
| `info` | `#0369A1` | Saran / info netral |

### Dark
| Token | Hex | Peran |
|---|---|---|
| `bg` | `#0E1614` | Latar halaman |
| `surface` | `#16211E` | Kartu, panel |
| `border` | `#2A3833` | Garis pemisah |
| `text` | `#EAF2EF` | Teks utama |
| `text-muted` | `#9DB0AA` | Teks sekunder |
| `primary` | `#2DD4BF` | Brand (lebih terang untuk kontras) |
| `primary-hover` | `#5EEAD4` | Hover |
| `on-primary` | `#04211E` | Teks di atas primary |
| `primary-soft` | `#12332E` | Highlight lembut |
| `success` | `#4ADE80` · `warning` `#FBBF24` · `danger` `#F87171` · `info` `#38BDF8` | Status (dinaikkan untuk dark) |

## 3. Typography Rules
- **Display / Heading:** `Plus Jakarta Sans` (700/600) — hangat, lokal, ramah.
- **Body / UI:** `Inter` (400/500) — legibilitas tinggi.

| Peran | Size / Line-height | Weight |
|---|---|---|
| Display (skor besar) | 48 / 52 | 700 |
| H1 | 28 / 34 | 700 |
| H2 | 22 / 28 | 600 |
| H3 | 18 / 24 | 600 |
| Body-lg | 16 / 26 | 400 |
| Body | 14 / 22 | 400 |
| Caption | 12 / 16 | 500 |

## 4. Component Stylings
- **Button / Primary:** bg `primary`, teks `on-primary`, radius 12px, padding 12×20, tinggi ≥44px. Hover `primary-hover`. Disabled: opacity 50%.
- **Button / Secondary:** bg `surface`, border `border`, teks `text`. Untuk aksi agentic ("Kirim remedial", "Notif wali").
- **Button / Ghost:** transparan, teks `primary`, tanpa border.
- **Card:** bg `surface`, border `border`, radius 16px, padding 20, shadow `sm`.
- **Input / TextField:** bg `surface`, border `border`, radius 10px, tinggi 44px; focus: border `primary` + ring 2px `primary-soft`.
- **Upload Dropzone:** dashed border `border` 2px, radius 16px, ikon kamera besar, teks ajakan. Aktif/drag: border `primary`, bg `primary-soft`.
- **Score Badge:** lingkaran/pill, warna dari bucket — ≥80 `success`, 50–79 `warning`, <50 `danger`. Angka pakai Display.
- **Structure Badge:** pill kecil `primary-soft` teks `primary` (sequence/branching/loop).
- **List item (transkrip):** bernomor, garis tipis antar item.
- **List item (isu logika):** ikon ⚠ warna `warning`. **(saran):** ikon 💡 warna `info`.

## 5. Layout Principles
- Spacing base **4px**: skala 4, 8, 12, 16, 24, 32, 48, 64.
- Konten maks-width 640px di mobile-first; desktop kartu tunggal terpusat, maks 720px untuk layar Hasil.
- Whitespace generous; jangan padat. Satu aksi utama menonjol per layar.

## 6. Depth & Elevation
Minimal & lembut (kesan tenang).
- `sm`: `0 1px 2px rgba(20,32,30,.06)` — kartu.
- `md`: `0 4px 12px rgba(20,32,30,.08)` — dropzone aktif, modal.
- Dark: shadow diganti border `border` + surface sedikit lebih terang.

## 7. Do's and Don'ts
- ✅ Kontras tinggi, tombol besar (≥44px), teks jelas.
- ✅ Warna status konsisten (hijau/kuning/merah = skor).
- ✅ Bahasa UI Indonesia, tanpa jargon teknis.
- ❌ Jangan gradien norak / warna ramai.
- ❌ Jangan sembunyikan aksi utama.
- ❌ Jangan desain yang butuh layar lebar.
- ❌ Jangan animasi berat.

## 8. Responsive Behavior
- Breakpoints: `sm` 640, `md` 768, `lg` 1024.
- Mobile-first: single-column, tombol full-width. Desktop: kartu terpusat.
- Touch target minimum 44×44px. Upload: tombol kamera/galeri di HP, drag-drop di desktop.

## 9. Agent Prompt Guide (quick ref)
`primary #0F766E` (brand/CTA) · `success #15803D` (skor baik) · `warning #B45309` (perlu perbaikan) · `danger #B91C1C` (kurang) · `info #0369A1` (saran). Font: Plus Jakarta Sans (heading) + Inter (body). Radius kartu 16 / tombol 12. Spacing kelipatan 4. Selalu sediakan light & dark.
