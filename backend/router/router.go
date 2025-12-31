package router

import (
	"ameato/handler"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

func NewRouter(
	_getHandler handler.GetHandlerInterface,
	_postHandler handler.PostHandlerInterface,
) *gin.Engine {


	router := gin.Default()
	binding.EnableDecoderDisallowUnknownFields = true
	
	router.GET("/health", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{
			"status": "ok",
		})
	})

	api := router.Group("/api")
	{
		api.GET("/messages", _getHandler.GetHandler)
		api.POST("/messages", _postHandler.PostHandler)
	}

	return router
}