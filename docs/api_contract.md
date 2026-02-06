# Gawain API Contract

> **Note**: This document describes the expected API contract for the Gawain video generation service. The actual API specification may differ. Update this document when the official API is finalized.

## Base URL

```
GAWAIN_API_BASE=https://api.gawain.example.com
```

## Authentication

All requests require a Bearer token:

```
Authorization: Bearer {GAWAIN_API_KEY}
```

Optional App ID header (if multi-tenant):

```
X-App-Id: {GAWAIN_APP_ID}
```

## Endpoints

### Create Job

Create a new video generation job.

```
POST /v1/jobs
```

**Request Body:**

```json
{
  "installId": "550e8400-e29b-41d4-a716-446655440000",
  "product": {
    "id": "B0123456789",
    "title": "Product Name",
    "description": "Product description text",
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ],
    "price": {
      "amount": "1000",
      "currency": "JPY"
    },
    "variants": [
      {
        "id": "v1",
        "title": "Default",
        "price": "1000"
      }
    ],
    "metadata": {
      "source": "amazon",
      "asin": "B0123456789"
    }
  },
  "options": {
    "style": "dynamic",
    "duration": 15,
    "quality": "preview"
  }
}
```

**Response (201 Created):**

```json
{
  "jobId": "job_abc123",
  "status": "pending",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Error Response (4xx/5xx):**

```json
{
  "code": "INVALID_PRODUCT",
  "message": "Product must have at least one image"
}
```

### Get Job Status

Check the status of a job.

```
GET /v1/jobs/{jobId}
```

**Response (200 OK) - Pending/Processing:**

```json
{
  "jobId": "job_abc123",
  "status": "processing",
  "progress": 45,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:31:00Z"
}
```

**Response (200 OK) - Completed:**

```json
{
  "jobId": "job_abc123",
  "status": "completed",
  "progress": 100,
  "previewUrl": "https://cdn.gawain.example.com/preview/job_abc123.mp4",
  "downloadUrl": "https://cdn.gawain.example.com/download/job_abc123.mp4",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:32:00Z"
}
```

**Response (200 OK) - Failed:**

```json
{
  "jobId": "job_abc123",
  "status": "failed",
  "error": {
    "code": "GENERATION_FAILED",
    "message": "Unable to process images"
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:31:30Z"
}
```

## Status Values

| Status | Description |
|--------|-------------|
| `pending` | Job created, waiting to start |
| `processing` | Video generation in progress |
| `completed` | Video ready, URLs available |
| `failed` | Generation failed, see error |

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_REQUEST` | 400 | Request body validation failed |
| `INVALID_PRODUCT` | 400 | Product data is invalid |
| `UNAUTHORIZED` | 401 | Missing or invalid API key |
| `FORBIDDEN` | 403 | API key lacks permission |
| `NOT_FOUND` | 404 | Job not found |
| `RATE_LIMITED` | 429 | Too many requests |
| `GENERATION_FAILED` | 500 | Internal generation error |

## Rate Limiting

- Rate limit: 100 requests per minute per API key
- Retry after: Check `Retry-After` header on 429 responses

## Quality Options

| Quality | Description | Typical Duration |
|---------|-------------|------------------|
| `preview` | Low resolution, fast | ~30 seconds |
| `standard` | Medium resolution | ~2 minutes |
| `high` | High resolution | ~5 minutes |

## Notes

- `installId` is required for all job creation requests
- Images must be publicly accessible URLs
- Maximum 10 images per product
- Preview URLs expire after 24 hours
- Download URLs require commercial subscription via Kinosuke
