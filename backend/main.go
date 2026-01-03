package main

import (
	"fmt"

	"github.com/joho/godotenv"
)

// @title ame:ato API
// @version 1.0
// @description This is the API documentation for the ame:ato application.
func main() {

	err := godotenv.Load()
	
	if err != nil {
		fmt.Println("Fatal: Error loading .env file", err)
		return
	}

	engine := InitializeRouter()
	engine.Run(":8000")
}
