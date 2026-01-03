package handler

import (
	"ameato/controller"

	"github.com/gin-gonic/gin"
)

type GetHandlerInterface interface {
	GetHandler(ctx *gin.Context)
}

type GetHandler struct {
	getMessageController controller.GetMessageControllerInterface
}

func NewGetHandler(getMessageController controller.GetMessageControllerInterface) *GetHandler {
	return &GetHandler{
		getMessageController: getMessageController,
	}
}

// @summary 表示可能なメッセージを取得する
// @description 表示可能なメッセージを取得します。
// @tags messages
// @produce json
// @Success 200 {object} model.MessagesResponse
// @Failure 500 {object} model.ErrorResponse
// @Router /api/messages [get]
func (h *GetHandler) GetHandler(ctx *gin.Context) {

	context := ctx.Request.Context()
	messages, err := h.getMessageController.GetMessages(context)

	if err != nil {
		ctx.JSON(500, gin.H{
			"error": "Failed to get messages",
		})
		return
	}	

	ctx.JSON(200, gin.H{
		"messages": messages,
	})
}