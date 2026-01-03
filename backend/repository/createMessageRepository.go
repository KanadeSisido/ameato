package repository

import (
	"ameato/model"
	"context"
	"time"

	"gorm.io/gorm"
)

type CreateMessageRepositoryInterface interface {
	CreateMessage(ctx context.Context, message model.CreateMessage) error
}

type CreateMessageRepository struct {
	DB *gorm.DB
}

func NewCreateMessageRepository(db *gorm.DB) *CreateMessageRepository {
	return &CreateMessageRepository{
		DB: db,
	}
}

func (r *CreateMessageRepository) CreateMessage(ctx context.Context, message model.CreateMessage) error {

	msg := model.Message{
		Content: message.Content,
		Position: model.Position{
			X: message.Position.X,
			Y: message.Position.Y,
		},
		CreatedAt: time.Now().Unix(),
	}
	
	err := gorm.G[model.Message](r.DB).Create(ctx, &msg)

	if err != nil {
		return err
	}

	return nil
}