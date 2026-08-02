package service

import (
	"github.com/hafidluqman/ct-bridge/backend/src/repository"
	"github.com/hafidluqman/ct-bridge/backend/src/service/analytics"
	"github.com/hafidluqman/ct-bridge/backend/src/service/autograd"
	"github.com/hafidluqman/ct-bridge/backend/src/service/codegen"
	"github.com/hafidluqman/ct-bridge/backend/src/service/external"
	"github.com/hafidluqman/ct-bridge/backend/src/service/followup"
	"github.com/hafidluqman/ct-bridge/backend/src/service/grading"
)

// Registry aggregates every domain service, wired with repositories and
// external clients by the bootstrap layer (field injection).
type Registry struct {
	Grading   *grading.GradingService
	Codegen   *codegen.CodegenService
	AutoGrad  *autograd.AutoGradService
	FollowUp  *followup.FollowUpService
	Analytics *analytics.AnalyticsService
}

func NewRegistry(repos repository.Registry, gemini *external.GeminiService, storage *external.StorageService) Registry {
	return Registry{
		Grading:   &grading.GradingService{Gemini: gemini, Storage: storage, Repo: repos.Submission},
		Codegen:   &codegen.CodegenService{Gemini: gemini, Repo: repos.Submission},
		AutoGrad:  &autograd.AutoGradService{Gemini: gemini, Repo: repos.Submission},
		FollowUp:  &followup.FollowUpService{Gemini: gemini, Repo: repos.Submission},
		Analytics: &analytics.AnalyticsService{Gemini: gemini, Repo: repos.Submission},
	}
}
