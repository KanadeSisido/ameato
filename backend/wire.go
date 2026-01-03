//go:build wireinject
// +build wireinject

package main

import (
	"ameato/controller"
	"ameato/db"
	"ameato/handler"
	"ameato/repository"
	"ameato/router"

	"github.com/gin-gonic/gin"
	"github.com/google/wire"
)


func InitializeRouter() *gin.Engine {

    wire.Build(
        db.InitDB,
        repository.NewCreateMessageRepository,
        repository.NewGetMessageRepository,
        controller.NewCreateMessageController,
        controller.NewGetMessageController,
        handler.NewGetHandler,
        handler.NewPostHandler,
        router.NewRouter,

		wire.Bind(new(handler.GetHandlerInterface), new(*handler.GetHandler)),
        wire.Bind(new(handler.PostHandlerInterface), new(*handler.PostHandler)),
		wire.Bind(new(controller.CreateMessageControllerInterface), new(*controller.CreateMessageController)),
		wire.Bind(new(controller.GetMessageControllerInterface), new(*controller.GetMessageController)),
		wire.Bind(new(repository.CreateMessageRepositoryInterface), new(*repository.CreateMessageRepository)),
		wire.Bind(new(repository.GetMessageRepositoryInterface), new(*repository.GetMessageRepository)),
		
    )
	
    return nil
}