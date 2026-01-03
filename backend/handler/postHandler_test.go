package handler_test

import (
	"ameato/handler"
	"ameato/mocks"
	"ameato/model"
	"encoding/json"
	"errors"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"go.uber.org/mock/gomock"
)


type testCasesType struct{
	name string
	in any
	mockCtl error
	expectCode int
	expectReturn gin.H
}

func TestPostHandler(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	postController := mocks.NewMockPostControllerInterface(ctrl)
	postHandler := handler.NewPostHandler(postController)
	binding.EnableDecoderDisallowUnknownFields = true

	cases := []testCasesType{
		{
			name: "正常系",
			in: model.CreateMessage{
				Content: "Hello",
				Position: model.Position{
					X: 0.5,
					Y: 0.5,
				},
			},
			mockCtl: nil,
			expectCode: 201,
			expectReturn: gin.H{
				"status": "Message posted successfully",
			},
		},
		{
			name: "異常系 - Contains Invalid Field",
			in: struct{
				Content string
				InvalidField string
				Position model.Position
			}{
				Content: "Hello",
				InvalidField: "invalid",
				Position: model.Position{
					X: 0.5,
					Y: 0.5,
				},
			},
			mockCtl: nil,
			expectCode: 400,
			expectReturn: gin.H{
				"error": "Invalid request body",
			},
		},

		{
			name: "異常系 - Missing Field",
			in: struct{
				Position model.Position
			}{
				Position: model.Position{
					X: 0.5,
					Y: 0.5,
				},
			},
			mockCtl: nil,
			expectCode: 400,
			expectReturn: gin.H{
				"error": "Invalid request body",
			},
		},
		{
			name: "異常系 - Controller Error",
			in: model.CreateMessage{
				Content: "Hello",
				Position: model.Position{
					X: 0.5,
					Y: 0.5,
				},
			},
			mockCtl: errors.New("Test Error"),
			expectCode: 500,
			expectReturn: gin.H{
				"error": "Test Error",
			},
		},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {

			w := httptest.NewRecorder()
			c, _ := gin.CreateTestContext(w)
			
			messageJson, _ := json.Marshal(tc.in)
	
			c.Request = httptest.NewRequest("POST", "/messages", strings.NewReader(string(messageJson)))
			c.Request.Header.Set("Content-Type", "application/json")
	
			if tc.expectCode != 400 {
				postController.EXPECT().PostMessages(gomock.Any(), gomock.Any()).Return(tc.mockCtl)
			}

			postHandler.PostHandler(c)
	
			if w.Code != tc.expectCode {
				t.Errorf("expected status %d, got %d", tc.expectCode, w.Code)
			}
	
			expectedBody, _ := json.Marshal(tc.expectReturn)
	
			if w.Body.String() != string(expectedBody) {
				t.Errorf("expected body %s, got %s", string(expectedBody), w.Body.String())
			}
		})

	}
}