package controller

import (
	"ameato/model"
	"ameato/repository"
	"context"
	"math"
	"time"
)

type GetControllerInterface interface {
	GetMessages(ctx context.Context) ([]model.MessageResponse, error)
}

type GetController struct {
	getMessageRepository repository.GetMessageRepositoryInterface
}

func NewGetController(_getMessageRepository repository.GetMessageRepositoryInterface) *GetController {
	return &GetController{
		getMessageRepository: _getMessageRepository,
	}
}

func (c *GetController) GetMessages(ctx context.Context) ([]model.MessageResponse, error){
	messages, err := c.getMessageRepository.GetMessages(ctx);

	if err != nil {
		return nil, err
	}

	messageResponse := make([]model.MessageResponse, len(messages))
	
	for i, msg := range messages {
		messageResponse[i] = messageToResponse(msg)
	}

	return messageResponse, nil
}

func messageToResponse(msg model.Message) model.MessageResponse {
	
	var opacity float64
	opacity = float64(time.Now().Sub(time.Unix(msg.CreatedAt, 0)).Seconds()) / (4 * 3600)
	
	opacity = math.Round((1 - opacity) * 1000) / 1000

	if opacity > 1 {
		opacity = 1
	} else if opacity < 0 {
		opacity = 0
	}
	
	return model.MessageResponse{
		Content:  msg.Content,
		Opacity:  opacity,
		Position: msg.Position,
	}
}