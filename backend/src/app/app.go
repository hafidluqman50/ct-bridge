package app

import (
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/hafidluqman/ct-bridge/backend/src/config"
)

// Run builds the HTTP handler and starts the server.
func Run() error {
	handler, err := buildHandler()
	if err != nil {
		return err
	}

	port := config.GetEnv("PORT")
	if port == "" {
		port = "8080"
	}
	if !strings.HasPrefix(port, ":") {
		port = ":" + port
	}

	server := &http.Server{
		Addr:              port,
		Handler:           handler,
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Printf("server listening on %s", port)
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		return fmt.Errorf("server: %w", err)
	}
	return nil
}
