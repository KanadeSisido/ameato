package handler_test

import (
	"ameato/handler"
	"ameato/mocks"
	"ameato/model"
	"encoding/json"
	"errors"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"go.uber.org/mock/gomock"
)

type GetHandlerTestCase struct {
	name           string
	ctrlReturn     ctrlReturn
	expectedStatus int
	expectedBody   gin.H
}

type ctrlReturn struct {
	messages []model.MessageResponse
	err      error
}

func TestGetHandler(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	getController := mocks.NewMockGetMessageControllerInterface(ctrl)
	getHandler := handler.NewGetHandler(getController)

	cases := []GetHandlerTestCase{
		{
			name: "正常系",
			ctrlReturn: ctrlReturn{
				messages: []model.MessageResponse{
					{Content: "Hello", Opacity: 1.0, Position: model.Position{X: 0.5, Y: 0.5}},
					{Content: "World", Opacity: 0.5, Position: model.Position{X: 0.5, Y: 0.5}},
				},
				err: nil,
			},
			expectedStatus: 200,
			expectedBody: gin.H{
				"messages": []model.MessageResponse{
					{Content: "Hello", Opacity: 1.0, Position: model.Position{X: 0.5, Y: 0.5}},
					{Content: "World", Opacity: 0.5, Position: model.Position{X: 0.5, Y: 0.5}},
				},
			},
		},
		{
			name: "正常系 - Expected empty messages",
			ctrlReturn: ctrlReturn{
				messages: []model.MessageResponse{
				},
				err: nil,
			},
			expectedStatus: 200,
			expectedBody: gin.H{
				"messages": []model.MessageResponse{
				},
			},
		},
		{
			name: "異常系 - Controller returns error",
			ctrlReturn: ctrlReturn{
				messages: []model.MessageResponse{
				},
				err: errors.New("controller error"),
			},
			expectedStatus: 500,
			expectedBody: gin.H{
				"error": "Failed to get messages",
			},
		},
		
	}
	
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			
			w := httptest.NewRecorder()
			c, _ := gin.CreateTestContext(w)

			c.Request = httptest.NewRequest("GET", "/messages", nil)
			c.Request.Header.Set("Content-Type", "application/json")
			getController.EXPECT().GetMessages(gomock.Any()).Return(tc.ctrlReturn.messages, tc.ctrlReturn.err)

			getHandler.GetHandler(c)

			// Check response status
			if w.Code != tc.expectedStatus {
				t.Errorf("expected status %d, got %d", tc.expectedStatus, w.Code)
			}

			// Check response body
			expectedBody, _ := json.Marshal(tc.expectedBody)
			if w.Body.String() != string(expectedBody) {
				t.Errorf("expected body %s, got %s", string(expectedBody), w.Body.String())
			}
		})
	}
}