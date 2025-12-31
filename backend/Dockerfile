FROM golang:1.25.5-alpine3.22
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download && go install github.com/air-verse/air@latest
COPY . .
EXPOSE 8080

CMD [ "air", "-c", "air.toml" ]