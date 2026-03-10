# VPS Stack (Docker Compose + Caddy)

1. Copy this folder to the server:
   - `/opt/hr-software/docker-compose.yml`
   - `/opt/hr-software/Caddyfile`
   - `/opt/hr-software/backend.env`
   - `/opt/hr-software/.env` (from `.env.example`)

2. Replace domains in `Caddyfile`:
   - `app.example.com`
   - `api.example.com`

3. Fill `backend.env` from `backend.env.example`.

4. Login to GHCR from server:
```bash
echo "$GHCR_TOKEN" | docker login ghcr.io -u "$GHCR_USERNAME" --password-stdin
```

5. Start stack:
```bash
cd /opt/hr-software
docker compose --env-file .env up -d
```

6. Check status/logs:
```bash
docker compose ps
docker compose logs -f caddy backend frontend
```
