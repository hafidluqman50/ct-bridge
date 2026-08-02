package grading

import "github.com/hafidluqman/ct-bridge/backend/src/service/grading"

// Dependencies holds everything the grading handlers need, injected once at
// bootstrap.
type Dependencies struct {
	Service *grading.GradingService
}
