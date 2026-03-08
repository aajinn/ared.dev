# Admin Dashboard Setup

## Overview

The admin dashboard provides a simple interface to manage projects without needing to edit code files directly.

## Access

Navigate to: `http://localhost:3000/admin`

## Features

### 1. Add New Project

Click "Add New Project" button to open the form:

- **Title**: Project name (auto-generates slug)
- **Slug**: URL-friendly identifier (auto-generated from title)
- **Description**: Detailed project description
- **Tech Stack**: Comma-separated list of technologies (e.g., "React, Node.js, MongoDB")
- **Price**: Project price in rupees
- **ZIP File**: Upload project files (.zip format)
- **Image**: Upload project thumbnail image

### 2. Edit Project

Click "Edit" button next to any project to:
- Update project details
- Replace ZIP file or image
- Change pricing

### 3. Delete Project

Click "Delete" button to remove a project (with confirmation).

## File Storage

### Project Files
- ZIP files are stored in: `storage/projects/`
- Naming convention: `{slug}.zip`
- Example: `ecommerce-platform.zip`

### Images
- Images are stored in: `public/images/`
- Naming convention: `{slug}.jpg`
- Example: `ecommerce-platform.jpg`

## Data Persistence

### Current Implementation (Development)
- Projects are stored in memory
- Changes are lost on server restart
- Suitable for testing and development

### Production Implementation

For production, replace the in-memory storage with a database:

#### Option 1: PostgreSQL with Prisma

```bash
npm install @prisma/client
npm install -D prisma
npx prisma init
```

Create schema:
```prisma
model Project {
  id          Int      @id @default(autoincrement())
  title       String
  slug        String   @unique
  description String
  techStack   String[]
  price       Int
  image       String
  downloadUrl String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### Option 2: MongoDB with Mongoose

```bash
npm install mongoose
```

Create model:
```typescript
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  description: String,
  techStack: [String],
  price: Number,
  image: String,
  downloadUrl: String,
});

export const Project = mongoose.model('Project', projectSchema);
```

## Security Considerations

### Authentication (Recommended for Production)

Add authentication to protect the admin dashboard:

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check authentication
    const token = request.cookies.get('admin-token');
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
}
```

### File Upload Validation

Add validation for uploaded files:
- Check file size limits
- Verify file types
- Scan for malware
- Validate ZIP contents

### Rate Limiting

Implement rate limiting to prevent abuse:
```bash
npm install express-rate-limit
```

## Cloud Storage Integration

For production, use cloud storage instead of local filesystem:

### AWS S3
```typescript
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: "us-east-1" });

const uploadToS3 = async (file: File, key: string) => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  await s3Client.send(new PutObjectCommand({
    Bucket: "your-bucket-name",
    Key: key,
    Body: buffer,
  }));
};
```

### Cloudinary (for images)
```bash
npm install cloudinary
```

```typescript
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

## Testing

1. Start the development server: `npm run dev`
2. Navigate to `/admin`
3. Add a test project with sample data
4. Upload a small ZIP file and image
5. Verify files are saved in correct directories
6. Test edit and delete functionality

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Role-based access control (admin, editor, viewer)
- [ ] Bulk upload projects
- [ ] Project categories and tags
- [ ] Sales analytics dashboard
- [ ] Customer management
- [ ] Order history
- [ ] Email notifications
- [ ] Audit logs
- [ ] Image optimization
- [ ] File compression
