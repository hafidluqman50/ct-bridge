package analytics

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/hafidluqman/ct-bridge/backend/src/http/request"
)

// Handler exposes the ClassMetrics natural-language query endpoint.
type Handler struct {
	deps Dependencies
}

func NewHandler(deps Dependencies) *Handler {
	return &Handler{deps: deps}
}

// Ask answers a teacher's natural-language question over all stored submissions.
func (h *Handler) Ask(c *gin.Context) {
	var req request.ClassQueryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "field 'question' wajib diisi"})
		return
	}

	answer, err := h.deps.Service.Ask(c.Request.Context(), req.Question)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, answer)
}
