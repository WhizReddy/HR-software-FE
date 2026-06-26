# People Hub HR Software Frontend

People Hub is a React, TypeScript, and Vite frontend for a small HR operations platform. It supports everyday HR work such as employee records, vacation requests, payroll review, candidate tracking, interview scheduling, events, inventory, asset holdings, notifications, and public recruitment.

## Core Features

- Authenticated HR workspace with role-based protected routes.
- Dashboard with attendance metrics, actionable follow-ups, calendar items, upcoming interviews, and upcoming events.
- Employee, candidate, payroll, vacation, inventory, and holdings views with search, filters, pagination, and export controls.
- Public careers board and recruitment form for applicant submissions.
- Event management with media upload, optional map picker, and event detail views.
- Notification dropdown with unread counts, period switching, retry states, and mark-read actions.

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- TanStack Query
- TanStack React Form
- Valibot
- Tailwind CSS
- Vitest and React Testing Library

## Project Structure

```text
src/
  Components/        Shared UI, layout, table, drawer, modal, and public nav
  Pages/             Feature pages such as Dashboard, Vacation, Events, Payroll
  features/auth/     Login, auth provider, protected-route logic
  Helpers/           Axios client, URL/filter helpers, formatting utilities
  hooks/             Shared hooks such as URL table state and page metadata
  types/             Shared API and table types
```

## Local Development

```bash
npm ci
cp .env.example .env
npm run dev
```

Set these values in `.env`:

```bash
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_MAPS_API_KEY=<your-google-maps-browser-key>
```

`VITE_API_URL` is required for backend API calls. The frontend does not fall back to a deployed backend when it is missing.

The map key is optional for basic app usage. Event map controls show a fallback state when the key is missing or loading fails.

## Quality Checks

Run these before pushing or deploying:

```bash
npm run lint
npm test
npm run build
git diff --check
```

The GitHub Actions workflow in `.github/workflows/frontend-ci.yml` runs lint, tests, and production build on pushes and pull requests.

## Manual Smoke Checks

- `/` login page
- `/career` public careers board
- `/recruitment` public application form
- `/applicant/confirm?token=test` confirmation route
- protected route redirect when logged out
- dashboard after login
- employees, candidates, vacation, payroll, inventory, holdings filters with refresh and back/forward navigation
- event create/edit drawer, media upload, event detail modal, optional map picker
- notification dropdown actions and mobile layout

## Deployment

1. Deploy the backend first and confirm `GET https://<your-backend-service>.onrender.com/health` returns `200`.
2. Push this repository to GitHub.
3. In Vercel, create or connect the project.
4. Set Vercel environment variables:

```bash
VITE_API_URL=https://<your-backend-service>.onrender.com
VITE_GOOGLE_MAPS_API_KEY=<your-google-maps-browser-key>
```

5. Deploy the project from Vercel or with:

```bash
vercel --prod
```

## Notes

- Backend is expected to run on Render free tier in the current deployment setup.
- If the backend sleeps, the first request may take 30-60+ seconds while Render wakes it up.
- Uploaded files and map features depend on the configured backend and optional Google Maps key.
