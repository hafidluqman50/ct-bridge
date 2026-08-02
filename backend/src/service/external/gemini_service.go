// Package external holds integrations with third-party services. GeminiService
// is the single client for Google's Gemini API and is the only place that knows
// how to talk to the vision model. Domain services depend on it, never on the
// raw HTTP shape.
package external

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

const geminiBaseURL = "https://generativelanguage.googleapis.com/v1beta/models"

// DefaultModel is the free-tier vision model proven to read handwritten
// flowcharts. Avoid *-pro / *-preview models: they return quota 0 on free tier.
const DefaultModel = "gemini-3.5-flash"

type GeminiService struct {
	APIKey     string
	Model      string
	HTTPClient *http.Client
}

func NewGeminiService(apiKey, model string) *GeminiService {
	if model == "" {
		model = DefaultModel
	}
	return &GeminiService{
		APIKey:     apiKey,
		Model:      model,
		HTTPClient: &http.Client{Timeout: 60 * time.Second},
	}
}

// --- request/response shapes for the generateContent endpoint ---

type geminiRequest struct {
	Contents         []geminiContent   `json:"contents"`
	GenerationConfig *generationConfig `json:"generationConfig,omitempty"`
}

type geminiContent struct {
	Parts []geminiPart `json:"parts"`
}

type geminiPart struct {
	Text       string            `json:"text,omitempty"`
	InlineData *geminiInlineData `json:"inline_data,omitempty"`
}

type geminiInlineData struct {
	MimeType string `json:"mime_type"`
	Data     string `json:"data"`
}

type generationConfig struct {
	ResponseMimeType string          `json:"responseMimeType,omitempty"`
	ResponseSchema   json.RawMessage `json:"responseSchema,omitempty"`
}

type geminiResponse struct {
	Candidates []struct {
		Content geminiContent `json:"content"`
	} `json:"candidates"`
	Error *struct {
		Code    int    `json:"code"`
		Message string `json:"message"`
		Status  string `json:"status"`
	} `json:"error"`
}

// GenerateFromImage sends an image plus a text prompt and returns the model's
// free-form text answer. Used by the validation probe.
func (s *GeminiService) GenerateFromImage(ctx context.Context, prompt string, image []byte, mimeType string) (string, error) {
	parts := []geminiPart{
		{Text: prompt},
		{InlineData: &geminiInlineData{MimeType: mimeType, Data: base64.StdEncoding.EncodeToString(image)}},
	}
	return s.call(ctx, parts, nil)
}

// GenerateJSONFromImage forces the model to answer as JSON matching the given
// response schema, returning the raw JSON bytes for the caller to unmarshal.
func (s *GeminiService) GenerateJSONFromImage(ctx context.Context, prompt string, image []byte, mimeType string, responseSchema json.RawMessage) ([]byte, error) {
	parts := []geminiPart{
		{Text: prompt},
		{InlineData: &geminiInlineData{MimeType: mimeType, Data: base64.StdEncoding.EncodeToString(image)}},
	}
	text, err := s.call(ctx, parts, responseSchema)
	if err != nil {
		return nil, err
	}
	return []byte(text), nil
}

// GenerateText sends a text-only prompt and returns the model's free-form answer.
func (s *GeminiService) GenerateText(ctx context.Context, prompt string) (string, error) {
	return s.call(ctx, []geminiPart{{Text: prompt}}, nil)
}

// GenerateJSON sends a text-only prompt and forces a JSON answer matching the
// given response schema, returning the raw JSON bytes for the caller to unmarshal.
func (s *GeminiService) GenerateJSON(ctx context.Context, prompt string, responseSchema json.RawMessage) ([]byte, error) {
	text, err := s.call(ctx, []geminiPart{{Text: prompt}}, responseSchema)
	if err != nil {
		return nil, err
	}
	return []byte(text), nil
}

func (s *GeminiService) call(ctx context.Context, parts []geminiPart, responseSchema json.RawMessage) (string, error) {
	if s.APIKey == "" {
		return "", fmt.Errorf("gemini api key is empty")
	}

	reqBody := geminiRequest{
		Contents: []geminiContent{{Parts: parts}},
	}
	if responseSchema != nil {
		reqBody.GenerationConfig = &generationConfig{
			ResponseMimeType: "application/json",
			ResponseSchema:   responseSchema,
		}
	}

	payload, err := json.Marshal(reqBody)
	if err != nil {
		return "", fmt.Errorf("encode request: %w", err)
	}

	url := fmt.Sprintf("%s/%s:generateContent?key=%s", geminiBaseURL, s.Model, s.APIKey)
	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(payload))
	if err != nil {
		return "", fmt.Errorf("build request: %w", err)
	}
	httpReq.Header.Set("Content-Type", "application/json")

	resp, err := s.HTTPClient.Do(httpReq)
	if err != nil {
		return "", fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	var out geminiResponse
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return "", fmt.Errorf("decode response (HTTP %d): %w", resp.StatusCode, err)
	}
	if out.Error != nil {
		return "", fmt.Errorf("gemini error (HTTP %d): %s - %s", resp.StatusCode, out.Error.Status, out.Error.Message)
	}
	if len(out.Candidates) == 0 || len(out.Candidates[0].Content.Parts) == 0 {
		return "", fmt.Errorf("empty response (HTTP %d)", resp.StatusCode)
	}

	var builder bytes.Buffer
	for _, part := range out.Candidates[0].Content.Parts {
		builder.WriteString(part.Text)
	}
	return builder.String(), nil
}
