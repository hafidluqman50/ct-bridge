// Command visiontest is a go/no-go probe: it sends a handwritten flowchart
// photo to the Gemini API and prints the extracted computational-thinking
// logic. It reuses the same GeminiService the backend uses, so there is no
// duplicated API client.
package main

import (
	"context"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/joho/godotenv"

	"github.com/hafidluqman/ct-bridge/backend/src/config"
	"github.com/hafidluqman/ct-bridge/backend/src/service/external"
)

const prompt = `Kamu menilai kerja computational thinking siswa. Baca gambar flowchart tulisan tangan ini, lalu jawab dalam Bahasa Indonesia:
1) Transkrip tiap langkah/blok dari atas ke bawah.
2) Sebutkan struktur algoritmanya (urutan / percabangan / perulangan).
3) Tunjukkan kalau ada langkah yang hilang atau tidak logis.
Kalau ada bagian gambar yang tidak terbaca (blur/terpotong), sebutkan secara eksplisit.`

func mimeFromExt(path string) string {
	switch strings.ToLower(filepath.Ext(path)) {
	case ".png":
		return "image/png"
	case ".webp":
		return "image/webp"
	default:
		return "image/jpeg"
	}
}

func main() {
	model := flag.String("model", external.DefaultModel, "Gemini model id (free tier: gemini-3.5-flash; hindari *-pro/*-preview = quota 0)")
	imgPath := flag.String("img", os.ExpandEnv("$HOME/flowchart_test.jpg"), "path ke foto flowchart")
	flag.Parse()

	_ = godotenv.Load(".env")
	apiKey := config.GetEnv("GEMINI_API_KEY")
	if apiKey == "" {
		fmt.Println("GEMINI_API_KEY kosong — set di backend/.env atau export ke environment")
		os.Exit(1)
	}

	imageBytes, err := os.ReadFile(*imgPath)
	if err != nil {
		fmt.Printf("gagal baca gambar di %s: %v\n", *imgPath, err)
		os.Exit(1)
	}
	fmt.Printf("Gambar: %s (%d KB)\n", *imgPath, len(imageBytes)/1024)
	fmt.Printf("Model : %s\n\n", *model)

	gemini := external.NewGeminiService(apiKey, *model)
	result, err := gemini.GenerateFromImage(context.Background(), prompt, imageBytes, mimeFromExt(*imgPath))
	if err != nil {
		fmt.Printf("ERROR: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("=== HASIL EKSTRAKSI GEMINI ===")
	fmt.Println(result)
}
