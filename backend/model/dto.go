package model

type CreateMessage struct {
	Content  string   `json:"content" binding:"required"`
	Position Position `json:"position" binding:"required"`
}

type MessageResponse struct {
	Content  string   `json:"content"`
	Opacity  float64  `json:"opacity"`
	Position Position `json:"position"`
}