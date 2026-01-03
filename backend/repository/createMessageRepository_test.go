package repository_test

import (
	"ameato/db"
	"ameato/model"
	"ameato/repository"
	"context"
	"testing"

	"gorm.io/gorm"
)

func TestCreateMessageRepository(t *testing.T) {
	db := db.InitTestDB(t)
	
	cases := []struct {
		name    string
		message model.CreateMessage
		}{
			{name: "正常系", message: model.CreateMessage{Content: "Hello, World!", Position: model.Position{X: 0.5, Y: 0.4}}},
		}
		
		for _, tc := range cases {
			t.Run(tc.name, func(t *testing.T) {
				tx := db.Begin()
				defer tx.Rollback()
				repository := repository.NewCreateMessageRepository(tx)
				err := repository.CreateMessage(context.Background(), tc.message)
				if err != nil {
					t.Fatalf("expected no error, got %v", err)
				}

				val, err := gorm.G[model.Message](tx).Where("content = ?", tc.message.Content).Find(context.Background())
			
				if err != nil {
					t.Fatalf("expected no error, got %v", err)
				}

				if len(val) != 1 {
					t.Fatalf("expected 1 message, got %d", len(val))
				}

				if val[0].Content != tc.message.Content {
					t.Fatalf("expected content %s, got %s", tc.message.Content, val[0].Content)
				}
				if val[0].Position.X != tc.message.Position.X || val[0].Position.Y != tc.message.Position.Y {
					t.Fatalf("expected position (%f, %f), got (%f, %f)", tc.message.Position.X, tc.message.Position.Y, val[0].Position.X, val[0].Position.Y)
				}
				if val[0].CreatedAt == 0 {
					t.Fatalf("expected created_at to be set, got %d", val[0].CreatedAt)
				}
			})
			
		}
	
}
