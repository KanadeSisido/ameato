package controller_test

import (
	"ameato/controller"
	"ameato/mocks"
	"ameato/model"
	"context"
	"errors"
	"testing"

	"go.uber.org/mock/gomock"
)

func TestPostController(t *testing.T) {

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	repo := mocks.NewMockCreateMessageRepositoryInterface(ctrl)
	
	cases := []struct {
		name string
		in model.CreateMessage
		ret error
		expErr bool
	}{
		{
			name: "Create Successfully",
			in: model.CreateMessage{
				Content: "Hello",
				Position: model.Position{
					X: 0.5,
					Y: 0.5,
				},
			},
			ret: nil,
			expErr: false,
		},
		{
			name: "Invalid Message Length - Empty",
			in: model.CreateMessage{
				Content: "",
				Position: model.Position{
					X: 0.5,
					Y: 0.5,
				},
			},
			ret: errors.New("invalid Message Length"),
			expErr: true,
		},
		{
			name: "Invalid Message Length - Too Long",
			in: model.CreateMessage{
				Content: "123456789_123456789_123456789_1",
				Position: model.Position{
					X: 0.5,
					Y: 0.5,
				},
			},
			ret: errors.New("invalid Message Length"),
			expErr: true,
		},
		
		{
			name: "Invalid X Position - 1",
			in: model.CreateMessage{
				Content: "Hello",
				Position: model.Position{
					X: -0.5,
					Y: 0.5,
				},
			},
			ret: errors.New("invalid Position Range"),
			expErr: true,
		},
		{
			name: "Invalid X Position - 2",
			in: model.CreateMessage{
				Content: "Hello",
				Position: model.Position{
					X: 1.5,
					Y: 0.5,
				},
			},
			ret: errors.New("invalid Position Range"),
			expErr: true,
		},
		{
			name: "Invalid Y Position - 1",
			in: model.CreateMessage{
				Content: "Hello",
				Position: model.Position{
					X: 0.5,
					Y: -0.5,
				},
			},
			ret: errors.New("invalid Position Range"),
			expErr: true,
		},
		{
			name: "Invalid Y Position - 2",
			in: model.CreateMessage{
				Content: "Hello",
				Position: model.Position{
					X: 0.5,
					Y: 1.5,
				},
			},
			ret: errors.New("invalid Position Range"),
			expErr: true,
		},
		{
			name: "Invalid XY Position",
			in: model.CreateMessage{
				Content: "Hello",
				Position: model.Position{
					X: -0.5,
					Y: 1.5,
				},
			},
			ret: errors.New("invalid Position Range"),
			expErr: true,
		},	
	}

	for _, tc := range cases {
		
		t.Run(tc.name, func(t *testing.T) {


			if !tc.expErr {
				repo.EXPECT().CreateMessage(gomock.Any(), tc.in).Return(nil)
			}

			createController := controller.NewPostController(repo)

			err := createController.PostMessages(context.Background(), tc.in)

			if tc.expErr {
				if err.Error() != tc.ret.Error() {
					
					t.Errorf("Expected error %v, got %v", tc.ret, err)

				} else if err == nil {
					
					t.Errorf("Expected error %v, got nil", tc.ret)
				
				}
				
			} else {
				if err != nil {
					t.Errorf("Expected no error, got %v", err)
				}
			}
			
		})
	}
}