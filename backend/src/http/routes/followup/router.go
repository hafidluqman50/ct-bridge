package followup

import (
	"github.com/gin-gonic/gin"

	followupHandler "github.com/hafidluqman/ct-bridge/backend/src/http/handlers/followup"
)

// RegisterRoutes mounts follow-up action endpoints under a submissions group,
// e.g. /api/v1/submissions/:id/remedial and /api/v1/submissions/:id/parent-message.
func RegisterRoutes(group *gin.RouterGroup, handler *followupHandler.Handler) {
	group.GET("/:id/remedial", handler.RemedialPlan)
	group.GET("/:id/parent-message", handler.ParentMessage)
}
