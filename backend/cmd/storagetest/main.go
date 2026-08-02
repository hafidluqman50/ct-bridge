// Command storagetest is a go/no-go probe for Supabase Storage: create the
// bucket, upload a test object, then fetch its public URL over plain HTTP to
// empirically confirm the bucket is actually publicly readable (not just
// that the upload succeeded).
package main

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"

	"github.com/hafidluqman/ct-bridge/backend/src/config"
	"github.com/hafidluqman/ct-bridge/backend/src/service/external"
)

func main() {
	_ = godotenv.Load(".env")

	endpoint := config.GetEnv("SUPABASE_S3_ENDPOINT")
	accessKey := config.GetEnv("SUPABASE_S3_ACCESS_KEY")
	secretKey := config.GetEnv("SUPABASE_S3_SECRET_KEY")
	region := config.GetEnv("SUPABASE_S3_REGION")
	bucket := config.GetEnv("SUPABASE_STORAGE_BUCKET")
	publicBaseURL := config.GetEnv("SUPABASE_PUBLIC_URL") + "/storage/v1/object/public"

	if endpoint == "" || accessKey == "" || secretKey == "" || bucket == "" {
		fmt.Println("Supabase S3 env vars belum lengkap")
		os.Exit(1)
	}

	storage := external.NewStorageService(endpoint, accessKey, secretKey, region, bucket, publicBaseURL)

	ctx := context.Background()

	fmt.Println("=== 1. EnsureBucket ===")
	if err := storage.EnsureBucket(ctx); err != nil {
		fmt.Println("ERROR:", err)
		os.Exit(1)
	}
	fmt.Println("OK — bucket ada/berhasil dibuat")

	fmt.Println("\n=== 2. Upload test object ===")
	testContent := []byte("ct-bridge storage probe " + time.Now().UTC().String())
	key := "probe/test.txt"
	url, err := storage.Upload(ctx, key, testContent, "text/plain")
	if err != nil {
		fmt.Println("ERROR:", err)
		os.Exit(1)
	}
	fmt.Println("Uploaded. Public URL:", url)

	fmt.Println("\n=== 3. Fetch public URL via HTTP (cek beneran public atau enggak) ===")
	resp, err := http.Get(url)
	if err != nil {
		fmt.Println("ERROR fetching:", err)
		os.Exit(1)
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)

	fmt.Println("HTTP Status:", resp.StatusCode)
	fmt.Println("Body:", string(body))

	if resp.StatusCode == http.StatusOK {
		fmt.Println("\n✅ BUCKET PUBLIC — foto akan bisa ditampilkan langsung via URL")
	} else {
		fmt.Println("\n❌ BUCKET BELUM PUBLIC (HTTP", resp.StatusCode, ") — perlu diaktifkan manual di Supabase Dashboard > Storage > bucket ini > toggle 'Public bucket'")
	}
}
