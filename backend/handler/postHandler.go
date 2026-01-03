package handler

import (
	"ameato/controller"
	"ameato/model"

	"github.com/gin-gonic/gin"
)

type PostHandlerInterface interface {
	PostHandler(ctx *gin.Context)
}

type PostHandler struct {
	createMessageController controller.CreateMessageControllerInterface
}

	func NewPostHandler(createMessageController controller.CreateMessageControllerInterface) *PostHandler {
	return &PostHandler{
		createMessageController: createMessageController,
	}
}

// @summary メッセージを投稿する
// @description メッセージを投稿します。
// @tags messages
// @accept json
// @produce json
// @param message body model.CreateMessage true "Message to create"
// @Success 200 {object} model.CreatedResponse
// @Failure 400 {object} model.ErrorResponse
// @Failure 500 {object} model.ErrorResponse
// @Router /api/messages [post]
func (h *PostHandler) PostHandler(ctx *gin.Context) {

	// ginから分離する
	context := ctx.Request.Context()
	var requestBody model.CreateMessage

	if err := ctx.ShouldBind(&requestBody); err != nil {
		ctx.JSON(400, gin.H{
			"error": "Invalid request body",
		})
		return
	}

	err := h.createMessageController.CreateMessage(context, requestBody)
	
	if err != nil {
		ctx.JSON(500, gin.H{
			"error": err.Error(),
		})
		return
	}

	ctx.JSON(201, gin.H{
		"status": "Message posted successfully",
	})
}