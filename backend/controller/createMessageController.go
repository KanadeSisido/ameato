package controller

import (
	"ameato/model"
	"ameato/repository"
	"context"
	"errors"
	"unicode/utf8"
)

type CreateMessageControllerInterface interface {
	CreateMessage(ctx context.Context, message model.CreateMessage) error
}

type CreateMessageController struct {
	createMessageRepository repository.CreateMessageRepositoryInterface
}

func NewCreateMessageController(createMessageRepository repository.CreateMessageRepositoryInterface) *CreateMessageController {
	return &CreateMessageController{
		createMessageRepository: createMessageRepository,
	}
}


func (c *CreateMessageController) CreateMessage(ctx context.Context, message model.CreateMessage) error {

	x := message.Position.X
	y := message.Position.Y

	if len(message.Content) == 0 || utf8.RuneCountInString(message.Content) > 30 {
		return errors.New("invalid Message Length")
	}

	if !isInRange(x, 0, 1) || !isInRange(y, 0, 1) {
		return errors.New("invalid Position Range")
	}

	if err := c.createMessageRepository.CreateMessage(ctx, message); err != nil {
		return errors.New("internal Server Error")
	}
	
	return nil

}

// 値が範囲内にある場合true, そうでない場合falseを返す関数
func isInRange(value float64, lowerLimit float64, upperLimit float64) bool {

	if lowerLimit > upperLimit {
		return false
	}

	if value > upperLimit {
		return false
	} else if value < lowerLimit {
		return false
	}

	return true
}