package codegen

import (
	"github.com/gin-gonic/gin"

	codegenHandler "github.com/hafidluqman/ct-bridge/backend/src/http/handlers/codegen"
)

// RegisterRoutes mounts code generation under a gradings group,
// e.g. POST /api/v1/gradings/:id/generate-code.
func RegisterRoutes(group *gin.RouterGroup, handler *codegenHandler.Handler) {
	group.POST("/:id/generate-code", handler.Generate)
}
