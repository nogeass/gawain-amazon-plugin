# gawain-amazon-plugin

Amazon plugin for Gawain video generation API - reference implementation.

## Overview

This plugin enables Amazon sellers to generate product videos using the Gawain API. It provides:

- **Anonymous previews**: Generate video previews without login using `install_id`
- **Amazon integration**: Convert Amazon product data to Gawain format
- **Commercial upgrade path**: Easy upgrade to commercial usage via Kinosuke

## Quick Start

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/nogeass/gawain-amazon-plugin.git
cd gawain-amazon-plugin

# Install dependencies
npm install

# Copy environment config
cp .env.example .env
# Edit .env with your Gawain API credentials
```

### Run Demo

```bash
# Using npm
npm run demo -- --product ./samples/product.sample.json

# Using make
make demo
```

### Docker

```bash
# Build and run
docker-compose run --rm app
```

## How It Works

```
+-----------------+
| Amazon Product  |
|     (JSON)      |
+--------+--------+
         |
         v
+-----------------+     +-----------------+
|    Amazon       |     |    Install ID   |
|    Adapter      |     |   (Anonymous)   |
+--------+--------+     +--------+--------+
         |                       |
         +-----------+-----------+
                     |
                     v
           +-----------------+
           |   Gawain API    |
           |  Create Job     |
           +--------+--------+
                    |
                    v (poll)
           +-----------------+
           |  Preview URL    |
           |  + Upgrade URL  |
           +-----------------+
```

1. **Load product**: Read Amazon product JSON
2. **Convert format**: Transform to Gawain API format
3. **Get install_id**: Use existing or generate new anonymous ID
4. **Create job**: Submit to Gawain API for video generation
5. **Poll status**: Wait for completion
6. **Get URLs**: Receive preview URL and Kinosuke upgrade URL

## Commercial Usage

This plugin generates **preview videos** for free. For commercial usage:

1. Run the demo to generate a preview
2. The output includes a Kinosuke upgrade URL with your `install_id`
3. Subscribe at Kinosuke to unlock commercial features
4. Your `install_id` will be linked to your Kinosuke account

## Project Structure

```
gawain-amazon-plugin/
├── docs/
│   ├── architecture.md    # System design
│   ├── api_contract.md    # API specifications
│   ├── local_dev.md       # Development guide
│   └── security.md        # Security considerations
├── samples/
│   └── product.sample.json
├── src/
│   ├── gawain/            # API client
│   ├── install/           # Install ID management
│   ├── platform/          # Platform adapters
│   ├── util/              # Utilities
│   ├── demo.ts            # CLI demo
│   └── index.ts           # Exports
├── Dockerfile
├── docker-compose.yml
├── Makefile
└── package.json
```

## Configuration

Environment variables (see `.env.example`):

| Variable | Required | Description |
|----------|----------|-------------|
| `GAWAIN_API_BASE` | Yes | Gawain API base URL |
| `GAWAIN_API_KEY` | Yes | API key |
| `GAWAIN_APP_ID` | No | Application ID |
| `KINOSUKE_UPGRADE_URL` | No | Upgrade URL |

## Development

```bash
# Run tests
npm test

# Lint
npm run lint

# Type check
npm run typecheck

# Build
npm run build
```

## Amazon Product Format

The adapter handles Amazon-specific product data including:

- **ASIN**: Amazon Standard Identification Number (used as product ID)
- **bullet_points**: Product feature bullets
- **images**: Product image URLs
- **price**: Price with currency
- **variations**: Size, color, and other variant options

See `samples/product.sample.json` for the expected format.

## Disclaimer

This is a **reference implementation** for demonstration purposes. It is not an official Amazon app and has not undergone Amazon app review.

For production use:
- Implement proper Amazon SP-API authentication
- Add error handling for your use case
- Subscribe to Kinosuke for commercial video generation

## License

Licensed under GNU AGPL v3.0. See [LICENSE](./LICENSE).

## Support

- Issues: [GitHub Issues](https://github.com/nogeass/gawain-amazon-plugin/issues)
- Security: See [SECURITY.md](./SECURITY.md)
