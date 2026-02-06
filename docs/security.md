# Security Guide

## Overview

This document outlines security considerations for the gawain-amazon-plugin.

## Credential Management

### API Keys

- **Never commit** API keys to version control
- Store API keys in environment variables only
- Use `.env` files locally (excluded from git)
- In production, use secure secret management (e.g., AWS Secrets Manager, HashiCorp Vault)

### .env File

```bash
# DO commit (template)
.env.example

# NEVER commit (actual secrets)
.env
.env.local
.env.production
```

## Install ID

The `install_id` is a UUID v4 used for anonymous tracking:

- Stored locally in `.local/install_id`
- Not a secret, but should not be shared publicly
- Used to link previews to commercial accounts later

### Storage Location

```
.local/
└── install_id    # UUID v4
```

This directory is:
- Excluded from git via `.gitignore`
- Persisted across Docker runs via volume mount

## API Communication

### HTTPS Only

All communication with Gawain API must use HTTPS:

```typescript
// Good
GAWAIN_API_BASE=https://api.gawain.example.com

// Bad - never use HTTP
GAWAIN_API_BASE=http://api.gawain.example.com
```

### Request Authentication

API keys are sent as Bearer tokens:

```
Authorization: Bearer {GAWAIN_API_KEY}
```

### Logging

Sensitive values are masked in logs:

```typescript
// API key: abc123xyz becomes abc1****xyz
maskSecret(apiKey);
```

## Input Validation

### Product Data

- ASIN is used as product ID
- Description text is passed through
- Image URLs are passed through (validated by Gawain API)
- Bullet points are joined into description

### File Paths

The demo CLI accepts file paths:
- Resolved to absolute paths
- Existence checked before reading
- JSON parsing errors are caught

## Dependencies

### Audit

Run regular security audits:

```bash
npm audit
```

### Updates

Keep dependencies updated:

```bash
npm update
npm audit fix
```

## Docker Security

### Non-Root User

Consider running as non-root (not implemented in current Dockerfile):

```dockerfile
RUN adduser --disabled-password --gecos '' appuser
USER appuser
```

### Read-Only Mounts

Sample files are mounted read-only:

```yaml
volumes:
  - ./samples:/app/samples:ro
```

## Reporting Vulnerabilities

See [SECURITY.md](../SECURITY.md) for vulnerability reporting process.

## Checklist

- [ ] `.env` is in `.gitignore`
- [ ] API keys are loaded from environment only
- [ ] HTTPS is used for all API calls
- [ ] Secrets are not logged
- [ ] `npm audit` passes
- [ ] Dependencies are up to date
