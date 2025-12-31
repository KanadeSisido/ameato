package main

import (
	"fmt"

	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load()
	
	if err != nil {
		fmt.Println("Fatal: Error loading .env file", err)
		return
	}

	engine := InitializeRouter()
	engine.Run(":8000")
}
