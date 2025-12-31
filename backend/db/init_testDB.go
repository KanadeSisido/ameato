package db

import (
	"ameato/model"
	"testing"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func InitTestDB(t *testing.T) *gorm.DB {
	t.Helper()

	db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})

	if err != nil {
		t.Fatalf("failed to connect database: %v", err)
		return nil
	}

	if err := db.AutoMigrate(&model.Message{}); err != nil {
		t.Fatalf("failed to migrate database: %v", err)
		return nil
	}

	return db
}