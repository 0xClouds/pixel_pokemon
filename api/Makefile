.PHONY: build run clean test

# Build the API server
build:
	go build -o pokemon-api main.go

# Run the API server
run:
	go run main.go

# Run with environment variables
run-dev:
	PORT=8080 go run main.go

# Clean up binaries
clean:
	rm -f pokemon-api

# Run tests
test:
	go test -v ./...

# Build for multiple platforms
build-all: clean
	GOOS=linux GOARCH=amd64 go build -o pokemon-api-linux-amd64 main.go
	GOOS=darwin GOARCH=amd64 go build -o pokemon-api-macos-amd64 main.go
	GOOS=windows GOARCH=amd64 go build -o pokemon-api-windows-amd64.exe main.go

# Default target
default: build 