package db

import (
	"ameato/model"
	"fmt"
	"os"
	"testing"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func InitTestDB(t *testing.T) *gorm.DB {
	t.Helper()

	err := godotenv.Load("../.env")
	if err != nil {
		t.Fatalf("failed to load environment variables: %v", err)
	}

	dsn := createTestDsn(os.Getenv("DB_USERNAME"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_TEST_NAME"))
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		t.Fatalf("failed to connect database: %v", err)
	}

	if err := db.AutoMigrate(&model.Message{}); err != nil {
		t.Fatalf("failed to migrate database: %v", err)
	}

	return db
}

func createTestDsn(username string, password string, dbname string) string {
	return fmt.Sprintf("%s:%s@tcp(localhost:3306)/%s?charset=utf8mb4&parseTime=True&loc=Local", username, password, dbname)
}