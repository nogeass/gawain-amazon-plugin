# Local Development Guide

## Prerequisites

- Node.js 20+
- npm (or pnpm)
- Docker (optional, for containerized development)

## Quick Start

```bash
# Clone the repository
git clone https://github.com/nogeass/gawain-amazon-plugin.git
cd gawain-amazon-plugin

# Install dependencies
npm install

# Copy environment config
cp .env.example .env
# Edit .env with your Gawain API credentials

# Run tests
npm test

# Run demo
npm run demo -- --product ./samples/product.sample.json
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GAWAIN_API_BASE` | Yes | Base URL for Gawain API |
| `GAWAIN_API_KEY` | Yes | API key for authentication |
| `GAWAIN_APP_ID` | No | Application ID (if required) |
| `KINOSUKE_UPGRADE_URL` | No | Upgrade URL for commercial usage |
| `GAWAIN_POLL_INTERVAL_MS` | No | Polling interval (default: 2000) |
| `GAWAIN_POLL_MAX_ATTEMPTS` | No | Max polling attempts (default: 60) |

## Development Commands

```bash
# Install dependencies
make install
# or: npm install

# Run linter
make lint
# or: npm run lint

# Run tests
make test
# or: npm test

# Run tests in watch mode
npm run test:watch

# Type checking
npm run typecheck

# Build TypeScript
make build
# or: npm run build

# Run demo
make demo
# or: npm run demo -- --product ./samples/product.sample.json
```

## Docker Development

```bash
# Build Docker image
make docker-build

# Run demo in Docker
make docker-dev
```

## Common Issues

### "Missing required environment variable"

Make sure you've created `.env` from `.env.example`:

```bash
cp .env.example .env
```

### "Product file not found"

Use absolute path or path relative to current directory:

```bash
npm run demo -- --product ./samples/product.sample.json
```

### TypeScript errors after changing files

Run the type checker:

```bash
npm run typecheck
```

### Tests failing with "fetch is not defined"

Make sure you're using Node.js 18+. The `fetch` API is built-in.

## Project Structure

```
gawain-amazon-plugin/
├── docs/                  # Documentation
├── samples/               # Sample data files
├── src/
│   ├── gawain/           # Gawain API client
│   │   ├── client.ts
│   │   └── types.ts
│   ├── install/          # Install ID management
│   │   └── install_id.ts
│   ├── platform/         # Platform adapters
│   │   └── amazon_adapter.ts
│   ├── util/             # Utilities
│   │   ├── env.ts
│   │   └── retry.ts
│   ├── demo.ts           # CLI demo
│   └── index.ts          # Main exports
├── .env.example          # Environment template
├── Dockerfile
├── docker-compose.yml
├── Makefile
├── package.json
└── tsconfig.json
```

## Adding a New Platform Adapter

1. Create `src/platform/newplatform_adapter.ts`
2. Implement conversion function: `convertNewPlatformProduct()`
3. Implement validation function: `validateNewPlatformProduct()`
4. Export from `src/index.ts`
5. Add tests in `src/platform/newplatform_adapter.test.ts`
