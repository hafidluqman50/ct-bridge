package followup

import "github.com/hafidluqman/ct-bridge/backend/src/service/followup"

// Dependencies holds everything the followup handlers need, injected once at
// bootstrap.
type Dependencies struct {
	Service *followup.FollowUpService
}
