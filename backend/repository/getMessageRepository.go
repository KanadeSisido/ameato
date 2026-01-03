package repository

import (
	"ameato/model"
	"context"
	"time"

	"gorm.io/gorm"
)

type GetMessageRepositoryInterface interface {
	GetMessages(ctx context.Context) ([]model.Message, error) 
}

type GetMessageRepository struct {
	DB *gorm.DB
}

func NewGetMessageRepository(db *gorm.DB) *GetMessageRepository {
	return &GetMessageRepository{
		DB: db,
	}
}

func (r *GetMessageRepository) GetMessages(ctx context.Context) ([]model.Message, error) {

	messages, err := gorm.G[model.Message](r.DB).Where("created_at > ?", time.Now().Add(-4 * time.Hour).Unix()).Find(ctx)

	if err != nil {
		return nil, err
	}

	return messages, nil
}