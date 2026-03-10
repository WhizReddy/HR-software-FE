# HR Software Frontend

React + TypeScript + Vite frontend for the HR software platform.

## Local Development

```bash
npm ci
npm run dev
```

Set env vars:

```bash
cp .env.example .env
```

## Production Container

Build image:

```bash
docker build -t hr-frontend --build-arg VITE_API_URL=https://api.example.com .
```

Run image:

```bash
docker run --rm -p 8080:80 hr-frontend
```

## CI/CD (GitHub Actions)

Workflow: `.github/workflows/deploy-frontend.yml`

Required repository secrets:

- `GHCR_USERNAME`
- `GHCR_TOKEN`
- `VITE_API_URL`
- `SSH_HOST`
- `SSH_USER`
- `SSH_KEY`
- `SSH_PORT` (optional)

## VPS Stack Templates

See `deploy/vps/` for:

- `docker-compose.yml`
- `Caddyfile`
- `backend.env.example`
- deployment runbook (`deploy/vps/README.md`)
