package autograd

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/hafidluqman/ct-bridge/backend/src/http/request"
)

// Handler exposes the code-alignment check: does a student's own code match
// the logic they drew on their own flowchart submission.
type Handler struct {
	deps Dependencies
}

func NewHandler(deps Dependencies) *Handler {
	return &Handler{deps: deps}
}

// CheckAlignment compares student-submitted code against the logic of the
// flowchart submission identified by :id.
func (h *Handler) CheckAlignment(c *gin.Context) {
	var req request.AlignmentCheckRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "field 'code' wajib diisi"})
		return
	}

	result, err := h.deps.Service.CheckAlignment(c.Request.Context(), c.Param("id"), req.Code)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, result)
}
