package config

import (
	"fmt"
	"os"
	"strings"
)

// GetEnv returns a trimmed environment value.
func GetEnv(key string) string {
	return strings.TrimSpace(os.Getenv(key))
}

// RequireEnv returns the value or an error when it is empty.
func RequireEnv(key string) (string, error) {
	value := GetEnv(key)
	if value == "" {
		return "", fmt.Errorf("%s is required", key)
	}
	return value, nil
}
