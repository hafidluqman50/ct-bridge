package codegen

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/hafidluqman/ct-bridge/backend/src/http/request"
)

// Handler exposes code generation FROM a graded flowchart's extracted logic —
// the literal "unplugged -> plugged" bridge.
type Handler struct {
	deps Dependencies
}

func NewHandler(deps Dependencies) *Handler {
	return &Handler{deps: deps}
}

// Generate produces runnable code implementing the flowchart submission
// identified by :id.
func (h *Handler) Generate(c *gin.Context) {
	var req request.GenerateCodeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "field 'language' wajib diisi"})
		return
	}

	artifact, err := h.deps.Service.Generate(c.Request.Context(), c.Param("id"), req.Language)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, artifact)
}
