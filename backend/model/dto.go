package model

type CreateMessage struct {
	Content  string   `json:"content" binding:"required"`
	Position Position `json:"position" binding:"required"`
}

type MessageResponse struct {
	Content  string   `json:"content" binding:"required"`
	Opacity  float64  `json:"opacity" binding:"required"`
	Position Position `json:"position" binding:"required"`
}

type MessagesResponse struct {
	Messages []MessageResponse `json:"messages" binding:"required"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

type CreatedResponse struct {
	Status string `json:"status"`
}