package followup

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Handler exposes follow-up actions (remedial plan, parent message draft)
// for an already-graded submission.
type Handler struct {
	deps Dependencies
}

func NewHandler(deps Dependencies) *Handler {
	return &Handler{deps: deps}
}

// RemedialPlan returns a concrete remedial teaching plan for a submission.
func (h *Handler) RemedialPlan(c *gin.Context) {
	plan, err := h.deps.Service.RemedialPlan(c.Request.Context(), c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, plan)
}

// ParentMessage returns a draft notification for a student's parent/guardian.
func (h *Handler) ParentMessage(c *gin.Context) {
	message, err := h.deps.Service.ParentMessage(c.Request.Context(), c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, message)
}
