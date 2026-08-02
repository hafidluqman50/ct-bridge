package autograd

import (
	"github.com/gin-gonic/gin"

	autogradHandler "github.com/hafidluqman/ct-bridge/backend/src/http/handlers/autograd"
)

// RegisterRoutes mounts the code-alignment check under a gradings group,
// e.g. POST /api/v1/gradings/:id/code-alignment.
func RegisterRoutes(group *gin.RouterGroup, handler *autogradHandler.Handler) {
	group.POST("/:id/code-alignment", handler.CheckAlignment)
}
