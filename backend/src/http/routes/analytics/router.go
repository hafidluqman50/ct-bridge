package analytics

import (
	"github.com/gin-gonic/gin"

	analyticsHandler "github.com/hafidluqman/ct-bridge/backend/src/http/handlers/analytics"
)

// RegisterRoutes mounts the ClassMetrics natural-language query endpoint.
func RegisterRoutes(group *gin.RouterGroup, handler *analyticsHandler.Handler) {
	group.POST("", handler.Ask)
}
