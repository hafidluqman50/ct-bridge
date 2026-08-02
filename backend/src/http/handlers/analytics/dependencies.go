package analytics

import "github.com/hafidluqman/ct-bridge/backend/src/service/analytics"

// Dependencies holds everything the analytics handlers need, injected once at
// bootstrap.
type Dependencies struct {
	Service *analytics.AnalyticsService
}
