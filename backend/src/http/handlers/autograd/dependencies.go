package autograd

import "github.com/hafidluqman/ct-bridge/backend/src/service/autograd"

// Dependencies holds everything the autograd handlers need, injected once at
// bootstrap.
type Dependencies struct {
	Service *autograd.AutoGradService
}
