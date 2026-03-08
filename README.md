# Next.js 14 App Router Project

A modern Next.js 14 application with TypeScript, Tailwind CSS, and App Router.

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── hello/
│   │   └── projects/
│   ├── admin/            # Admin page
│   ├── projects/         # Projects pages
│   │   ├── [slug]/       # Dynamic project page
│   │   └── page.tsx      # Projects list
│   ├── success/          # Success page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Homepage
│   └── globals.css       # Global styles
├── components/           # Reusable components
│   ├── Button.tsx
│   └── Card.tsx
└── ...config files
```

## Pages

- `/` - Homepage
- `/projects` - Projects list
- `/projects/[slug]` - Individual project page
- `/success` - Success confirmation page
- `/admin` - Admin dashboard

## API Routes

- `GET /api/hello` - Simple hello endpoint
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React 18
