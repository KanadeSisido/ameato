package model

import (
	"gorm.io/gorm"
)

type Message struct {
	gorm.Model
	Content   string   `json:"content" binding:"required"`
	CreatedAt int64    `json:"created_at" binding:"required"`
	Position  Position `json:"position" binding:"required" gorm:"embedded"`
}

type Position struct {
	X float64 `json:"x" binding:"required"`
	Y float64 `json:"y" binding:"required"`
}