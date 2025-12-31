package handler

import (
	"ameato/controller"

	"github.com/gin-gonic/gin"
)

type GetHandlerInterface interface {
	GetHandler(ctx *gin.Context)
}

type GetHandler struct {
	getController controller.GetControllerInterface
}

func NewGetHandler(getController controller.GetControllerInterface) *GetHandler {
	return &GetHandler{
		getController: getController,
	}
}

func (h *GetHandler) GetHandler(ctx *gin.Context) {

	context := ctx.Request.Context()
	messages, err := h.getController.GetMessages(context)

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