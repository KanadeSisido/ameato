package controller_test

import (
	"ameato/controller"
	"ameato/mocks"
	"ameato/model"
	"context"
	"errors"
	"testing"
	"time"

	"go.uber.org/mock/gomock"
)


type GetMessagesTestCase struct {
	name string
	messages []MessageTest
	err error
}

type MessageTest struct {
	msg model.Message
	expectOpacity float64
}


func TestGetMessages(t *testing.T) {
	
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	repo := mocks.NewMockGetMessageRepositoryInterface(ctrl)

	now := time.Now()

	cases := []GetMessagesTestCase{

		{
			name: "No messages",
			messages: []MessageTest{},
			err: nil,
		},
		{
			name: "Some messages",
			messages: []MessageTest{
				{
					msg: model.Message{CreatedAt: now.Add(-time.Hour).Unix(), Content: "Hello"},
					expectOpacity: float64(3) / float64(4),
				},
				{
					msg: model.Message{CreatedAt: now.Unix(), Content: "World"},
					expectOpacity: 1.0,
				},
			},
			err: nil,
		},
		{
			name: "Error fetching messages",
			messages: []MessageTest{},
			err: errors.New("database error"),
		},
		
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {

			// prepare test messages
			testMessages := make([]model.Message, len(tc.messages))
			for i, m := range tc.messages {
				testMessages[i] = m.msg
			}
			
			repo.EXPECT().GetMessages(gomock.Any()).Return(testMessages, tc.err)

			GetController := controller.NewGetController(repo)
			messages, err := GetController.GetMessages(context.Background())

			// error check
			if err != tc.err {
				t.Errorf("Expected error %v, got %v", tc.err, err)
			}

			// messages length check
			if len(messages) != len(tc.messages) {
				t.Errorf("Expected %d messages, got %d", len(tc.messages), len(messages))
			}

			// messages content check
			for idx, msg := range messages {

				if msg.Content != tc.messages[idx].msg.Content {
					t.Errorf("Expected message content %s, got %s", tc.messages[idx].msg.Content, msg.Content)
				}

				if msg.Position != tc.messages[idx].msg.Position {
					t.Errorf("Expected message position (%f, %f), got (%f, %f)", tc.messages[idx].msg.Position.X, tc.messages[idx].msg.Position.Y, msg.Position.X, msg.Position.Y)
				}

				if int(msg.Opacity * 1000) != int(tc.messages[idx].expectOpacity * 1000) {
					t.Errorf("Expected message opacity %f, got %f", tc.messages[idx].expectOpacity, msg.Opacity)
				}

			}

		})
	}
}