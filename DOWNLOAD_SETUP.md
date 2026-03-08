# Secure Download System Setup

## Overview

This system implements secure file downloads with temporary signed links that expire after 24 hours.

## How It Works

1. After successful payment, a secure download token is generated
2. Token contains: projectId, userId (optional), and expiration timestamp
3. Token is signed with HMAC SHA256 to prevent tampering
4. Download link is valid for 24 hours
5. File is served securely through `/api/download` endpoint

## Setup Instructions

### 1. Environment Variables

Add to `.env.local`:

```env
DOWNLOAD_SECRET_KEY=your-super-secret-download-key-change-in-production
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

For production, use a strong random key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Storage Directory

Create the storage directory structure:

```
storage/
└── projects/
    ├── ecommerce-platform.zip
    ├── ai-chatbot-system.zip
    ├── hospital-management-system.zip
    ├── social-media-dashboard.zip
    └── online-learning-platform.zip
```

Place your project ZIP files in `storage/projects/` with filenames matching the project slugs.

### 3. Production Setup (Cloud Storage)

For production, replace the local file system with cloud storage:

#### AWS S3 Example:

```typescript
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({ region: "us-east-1" });

const command = new GetObjectCommand({
  Bucket: "your-bucket-name",
  Key: `projects/${project.slug}.zip`,
});

const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
```

#### Google Cloud Storage Example:

```typescript
import { Storage } from "@google-cloud/storage";

const storage = new Storage();
const bucket = storage.bucket("your-bucket-name");
const file = bucket.file(`projects/${project.slug}.zip`);

const [signedUrl] = await file.getSignedUrl({
  action: "read",
  expires: Date.now() + 24 * 60 * 60 * 1000,
});
```

## API Routes

### POST /api/generate-download-link

Generates a secure download link with expiration.

**Request:**
```json
{
  "projectId": 1,
  "userId": "optional-user-id"
}
```

**Response:**
```json
{
  "success": true,
  "downloadUrl": "http://localhost:3000/api/download?token=...",
  "expiresIn": "24 hours"
}
```

### GET /api/download?token={token}

Downloads the file if token is valid.

**Response:**
- Success: ZIP file download
- Error: JSON error message

## Security Features

- ✓ HMAC SHA256 signature verification
- ✓ Token expiration (24 hours)
- ✓ No direct file path exposure
- ✓ Server-side validation
- ✓ One-time use tokens (optional enhancement)
- ✓ User-specific tokens (optional)

## Testing

1. Complete a test payment
2. Check the success page for download link
3. Verify link works within 24 hours
4. Verify link expires after 24 hours

## Future Enhancements

- Track download counts per purchase
- Implement download limits (e.g., 5 downloads per purchase)
- Add download history for users
- Email download links
- Resume interrupted downloads
- Virus scanning before download
