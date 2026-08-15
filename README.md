# NexaFlow

Production-quality MERN SaaS CRM and project management platform with React, Node.js, Express, MongoDB, TypeScript and Capacitor.

## Live Demo

NexaFlow is deployed on Vercel:

https://nexaflow-olive.vercel.app/

## Features

- CRM for customers, leads, deals, and a Kanban sales pipeline.
- Project and task management with role-aware API authorization.
- Premium responsive UI with desktop sidebar and mobile bottom navigation.
- Analytics dashboard with Recharts and realistic seeded business data.
- JWT authentication, bcrypt password hashing, validation, rate limiting, security headers, and centralized errors.
- Capacitor configuration so the same responsive React codebase can be adapted for web, Android, and iOS builds.
- Vitest, React Testing Library, and Supertest coverage for critical flows.

## Tech Stack

React 19, TypeScript 7, Vite 6, Redux Toolkit, RTK Query, Tailwind CSS, Recharts, React Hook Form, Zod, Axios, Node.js, Express 5, MongoDB/Mongoose, JWT, bcrypt, Capacitor 8.

## Folder Structure

```
nexaflow/
  apps/web
  apps/server
  packages/shared
  docs
  capacitor.config.ts
```

## Setup

```bash
npm install
npm run dev
```

The API runs on `http://localhost:4200` and the web app runs on `http://localhost:5173`.

## Environment

Copy `apps/server/.env.example` to `apps/server/.env` when using MongoDB:

```
PORT=4200
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/nexaflow
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
```

Without `MONGO_URI`, NexaFlow starts with the included sample workspace data.

## Demo Accounts

- Admin: `admin@nexaflow.demo`
- Manager: `manager@nexaflow.demo`
- Team Member: `member@nexaflow.demo`
- Password: `NexaFlowDemo!2026`

## API

See [docs/API.md](docs/API.md). The API includes pagination, search-ready list endpoints, validation, JWT protection, and role checks for privileged writes.

## Testing and Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Capacitor

NexaFlow is designed as a responsive web app first, with Capacitor configuration included so it can be packaged for Android and iOS from the same frontend codebase.

```bash
npm run build -w @nexaflow/web
npx cap add android
npx cap add ios
npm run cap:sync
```

Android can be opened in Android Studio. iOS can be opened in Xcode on macOS.

## Deployment

The included `vercel.json` builds both the Express API and the React frontend. Vercel serves the frontend from `apps/web/dist`, routes `/api/*` to the serverless Express adapter in `api/[...path].js`, and rewrites all other paths to `index.html` so React Router routes such as `/login` and `/dashboard` work on refresh.

For evaluation deployments, Vercel can run with the included sample workspace data. For persistent environments, add these Vercel environment variables:

```
MONGO_URI=your-mongodb-atlas-uri
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-vercel-domain.vercel.app
```

If you deploy the backend separately to Render, Railway, Fly.io, or similar, set `VITE_API_URL` in Vercel to that backend origin plus `/api`, for example `https://nexaflow-api.onrender.com/api`.

## Known Limitations

The repository is MongoDB-ready and includes Mongoose schemas/indexes, while local preview can run with sample workspace data when MongoDB credentials are not configured. Native Android/iOS packaging requires the standard Android Studio and Xcode toolchains after Capacitor generation.
