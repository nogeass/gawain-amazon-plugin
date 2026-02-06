.PHONY: install dev demo test lint build clean docker-build docker-dev help

# Default target
help:
	@echo "gawain-amazon-plugin - Available commands:"
	@echo ""
	@echo "  make install     Install dependencies"
	@echo "  make dev         Run demo in watch mode"
	@echo "  make demo        Run demo once"
	@echo "  make test        Run tests"
	@echo "  make lint        Run linter"
	@echo "  make build       Build TypeScript"
	@echo "  make clean       Clean build artifacts"
	@echo "  make docker-build Build Docker image"
	@echo "  make docker-dev  Run demo in Docker"
	@echo ""

# Install dependencies
install:
	npm install

# Development mode (watch)
dev:
	npm run dev

# Run demo
demo:
	npm run demo -- --product ./samples/product.sample.json

# Run tests
test:
	npm test

# Run linter
lint:
	npm run lint

# Build TypeScript
build:
	npm run build

# Clean build artifacts
clean:
	npm run clean
	rm -rf node_modules

# Docker build
docker-build:
	docker build -t gawain-amazon-plugin .

# Docker dev/demo
docker-dev:
	docker-compose run --rm app npm run demo -- --product ./samples/product.sample.json
