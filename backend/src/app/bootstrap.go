package app

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"

	"github.com/joho/godotenv"

	"github.com/hafidluqman/ct-bridge/backend/src/config"
	"github.com/hafidluqman/ct-bridge/backend/src/http/routes"
	"github.com/hafidluqman/ct-bridge/backend/src/model"
	"github.com/hafidluqman/ct-bridge/backend/src/repository"
	"github.com/hafidluqman/ct-bridge/backend/src/service"
	"github.com/hafidluqman/ct-bridge/backend/src/service/external"
)

// buildHandler wires every layer once: config -> database -> external
// clients -> repositories -> services -> router.
func buildHandler() (http.Handler, error) {
	_ = godotenv.Load()

	apiKey, err := config.RequireEnv("GEMINI_API_KEY")
	if err != nil {
		return nil, fmt.Errorf("config: %w", err)
	}

	db, err := config.NewDatabase()
	if err != nil {
		return nil, fmt.Errorf("database: %w", err)
	}
	if err := db.AutoMigrate(&model.Submission{}); err != nil {
		return nil, fmt.Errorf("migrate database: %w", err)
	}

	geminiService := external.NewGeminiService(apiKey, config.GetEnv("GEMINI_MODEL"))

	var storageService *external.StorageService
	s3Endpoint := config.GetEnv("SUPABASE_S3_ENDPOINT")
	s3AccessKey := config.GetEnv("SUPABASE_S3_ACCESS_KEY")
	s3SecretKey := config.GetEnv("SUPABASE_S3_SECRET_KEY")
	bucket := config.GetEnv("SUPABASE_STORAGE_BUCKET")
	if s3Endpoint != "" && s3AccessKey != "" && s3SecretKey != "" && bucket != "" {
		region := config.GetEnv("SUPABASE_S3_REGION")
		publicBaseURL := config.GetEnv("SUPABASE_PUBLIC_URL") + "/storage/v1/object/public"
		storageService = external.NewStorageService(s3Endpoint, s3AccessKey, s3SecretKey, region, bucket, publicBaseURL)
		if err := storageService.EnsureBucket(context.Background()); err != nil {
			slog.Warn("ensure storage bucket failed; photo uploads will be skipped", "error", err)
			storageService = nil
		}
	} else {
		slog.Warn("supabase storage not configured; flowchart photos will not be persisted")
	}

	repos := repository.NewRegistry(db)
	services := service.NewRegistry(repos, geminiService, storageService)

	return routes.SetupRouter(services), nil
}
