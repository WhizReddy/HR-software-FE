# HR Software Frontend

React + TypeScript + Vite frontend for the HR software platform.

## Local Development

```bash
npm ci
cp .env.example .env
npm run dev
```

Set these values in `.env` for local development:

- `VITE_API_URL=http://localhost:3000`
- `VITE_GOOGLE_MAPS_API_KEY=<your-google-maps-browser-key>`

## Free Deployment (Vercel)

1. Deploy the backend first and confirm `GET https://<your-backend-service>.onrender.com/health` returns `200`.
2. Push this repository to GitHub.
3. In Vercel, create a new project from this repo.
4. Set environment variables in Vercel:
   - `VITE_API_URL=https://<your-backend-service>.onrender.com`
   - `VITE_GOOGLE_MAPS_API_KEY=<your-google-maps-browser-key>`
5. Deploy.

## CI

Workflow: `.github/workflows/frontend-ci.yml`

Runs on pushes/PRs:
- `npm run lint`
- `npm run build`

## Notes

- Backend is expected to run on Render free tier.
- If your backend sleeps on free tier, the first request can take 30-60+ seconds while Render wakes it up.
- Uploaded files and map features depend on the two Vite env vars above being present in Vercel.
