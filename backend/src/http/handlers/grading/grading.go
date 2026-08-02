package grading

import (
	"io"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
)

// Handler exposes grading endpoints.
type Handler struct {
	deps Dependencies
}

func NewHandler(deps Dependencies) *Handler {
	return &Handler{deps: deps}
}

// Create accepts a multipart photo upload of a student's handwritten work,
// grades it via the AI vision model, and returns the structured result.
func (h *Handler) Create(c *gin.Context) {
	fileHeader, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "field 'image' wajib diisi (multipart file)"})
		return
	}

	file, err := fileHeader.Open()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "gagal membuka file"})
		return
	}
	defer file.Close()

	imageBytes, err := io.ReadAll(file)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "gagal membaca file"})
		return
	}

	studentName := strings.TrimSpace(c.PostForm("student_name"))
	if studentName == "" {
		studentName = "Tanpa Nama"
	}

	submission, err := h.deps.Service.Grade(
		c.Request.Context(),
		studentName,
		fileHeader.Filename,
		imageBytes,
		mimeFromName(fileHeader.Filename),
	)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, submission)
}

// List returns all graded submissions.
func (h *Handler) List(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"data": h.deps.Service.List()})
}

// Get returns one submission by id.
func (h *Handler) Get(c *gin.Context) {
	submission, ok := h.deps.Service.Get(c.Param("id"))
	if !ok {
		c.JSON(http.StatusNotFound, gin.H{"error": "submission tidak ditemukan"})
		return
	}
	c.JSON(http.StatusOK, submission)
}

func mimeFromName(name string) string {
	switch strings.ToLower(filepath.Ext(name)) {
	case ".png":
		return "image/png"
	case ".webp":
		return "image/webp"
	default:
		return "image/jpeg"
	}
}
