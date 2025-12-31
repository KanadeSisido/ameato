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
	postController controller.PostControllerInterface
}

	func NewPostHandler(postController controller.PostControllerInterface) *PostHandler {
	return &PostHandler{
		postController: postController,
	}
}

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

	err := h.postController.PostMessages(context, requestBody)
	
	if err != nil {
		ctx.JSON(500, gin.H{
			"error": err.Error(),
		})
		return
	}

	ctx.JSON(200, gin.H{
		"status": "Message posted successfully",
	})
}