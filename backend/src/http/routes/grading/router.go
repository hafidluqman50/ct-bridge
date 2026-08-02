package grading

import (
	"github.com/gin-gonic/gin"

	gradingHandler "github.com/hafidluqman/ct-bridge/backend/src/http/handlers/grading"
)

// RegisterRoutes mounts grading endpoints onto the given router group.
func RegisterRoutes(group *gin.RouterGroup, handler *gradingHandler.Handler) {
	group.POST("", handler.Create)
	group.GET("", handler.List)
	group.GET("/:id", handler.Get)
}
