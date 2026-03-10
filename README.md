# HR Software Frontend

React + TypeScript + Vite frontend for the HR software platform.

## Local Development

```bash
npm ci
cp .env.example .env
npm run dev
```

## Free Deployment (Vercel)

1. Push this repository to GitHub.
2. In Vercel, create a new project from this repo.
3. Set environment variable in Vercel:
   - `VITE_API_URL=https://<your-backend-service>.onrender.com`
4. Deploy.

## CI

Workflow: `.github/workflows/frontend-ci.yml`

Runs on pushes/PRs:
- `npm run lint`
- `npm run build`

## Notes

- Backend is expected to run on Render free tier.
- If your backend sleeps on free tier, first request may be slow.
