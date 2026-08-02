package config

import (
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// NewDatabase opens a Postgres connection using DATABASE_URL.
func NewDatabase() (*gorm.DB, error) {
	dsn, err := RequireEnv("DATABASE_URL")
	if err != nil {
		return nil, err
	}

	// PreferSimpleProtocol disables pgx's prepared-statement caching, which is
	// required behind Supabase's transaction-mode connection pooler (Supavisor):
	// pooled connections are shared across clients, so cached prepared
	// statements collide ("prepared statement ... already exists").
	db, err := gorm.Open(postgres.New(postgres.Config{
		DSN:                  dsn,
		PreferSimpleProtocol: true,
	}), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
	})
	if err != nil {
		return nil, fmt.Errorf("connect database: %w", err)
	}
	return db, nil
}
