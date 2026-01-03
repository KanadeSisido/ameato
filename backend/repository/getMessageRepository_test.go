package repository_test

import (
	"ameato/db"
	"ameato/model"
	"ameato/repository"
	"context"
	"sort"
	"testing"
	"time"

	"gorm.io/gorm"
)

func TestGetMessageRepository(t *testing.T) {
	db := db.InitTestDB(t)

	cases := []struct {
		name     string
		messages []model.Message
	}{
		{
			name: "正常系 - すべて表示範囲内",
			messages: []model.Message{
				{Content: "Hello, World!", Position: model.Position{X: 0.5, Y: 0.4}, CreatedAt: time.Now().Add(-time.Hour).Unix()},
				{Content: "こんにちは、世界！", Position: model.Position{X: 0.2, Y: 0.8}, CreatedAt: time.Now().Add(-30 * time.Minute).Unix()},
			},
		},
		{
			name:     "正常系 - 空",
			messages: []model.Message{},
		},
		{
			name: "正常系 - 時間範囲内＋外",
			messages: []model.Message{
				{Content: "Out of bounds2", Position: model.Position{X: 0.5, Y: 0.4}, CreatedAt: time.Now().Add(-5 * time.Hour).Unix()},
				{Content: "Out of bounds1", Position: model.Position{X: 0.5, Y: 0.4}, CreatedAt: time.Now().Add(-4 * time.Hour).Unix()},
				{Content: "Hello, World!", Position: model.Position{X: 0.5, Y: 0.4}, CreatedAt: time.Now().Add(-time.Hour).Unix()},
			},
		},
		{
			name: "正常系 - すべて表示範囲外",
			messages: []model.Message{
				{Content: "Out of bounds2", Position: model.Position{X: 0.5, Y: 0.4}, CreatedAt: time.Now().Add(-5 * time.Hour).Unix()},
				{Content: "Out of bounds1", Position: model.Position{X: 0.5, Y: 0.4}, CreatedAt: time.Now().Add(-4 * time.Hour).Unix()},
			},
		},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			tx := db.Begin()
			defer tx.Rollback()

			// create test messages
			for _, msg := range tc.messages {
				if err := gorm.G[model.Message](tx).Create(context.Background(), &msg); err != nil {
					t.Fatalf("failed to create message: %v", err)
				}
			}

			repository := repository.NewGetMessageRepository(tx)
			
			result, err := repository.GetMessages(context.Background())
			if err != nil {
				t.Fatalf("expected no error, got %v", err)
			}
			
			var expected []model.Message
			cutoff := time.Now().Add(-4 * time.Hour).Unix()
			
			for _, msg := range tc.messages {
				if msg.CreatedAt > cutoff {
					expected = append(expected, msg)
				}
			}

			if len(result) != len(expected) {
				t.Fatalf("expected %d messages, got %d", len(expected), len(result))
			}

			// sort
			sort.Slice(result, func(i, j int) bool {
				return result[i].CreatedAt < result[j].CreatedAt
			})
			sort.Slice(expected, func(i, j int) bool {
				return expected[i].CreatedAt < expected[j].CreatedAt
			})

			for i, msg := range expected {
				if result[i].Content != msg.Content || result[i].Position.X != msg.Position.X || result[i].Position.Y != msg.Position.Y || result[i].CreatedAt != msg.CreatedAt {
					t.Fatalf("expected message %v, got %v", msg, result[i])
				}
			}
		})
	}

}
