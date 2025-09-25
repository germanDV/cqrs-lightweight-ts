# Collateral Arrangements API

- Framework: Hono
- Runtime: Node.js (>= 22.18)
- Logging: pino (middleware)
- OpenAPI: @hono/zod-openapi (OpenAPI 3.1), exposed at `/openapi.json`
- Package Manager: pnpm (>= 10.16)

1. Install dependencies

```shell
   pnpm install
```

2. Run in dev mode (with tsx watcher). The server starts at http://localhost:3000

```shell
   pnpm dev
```

3. Build and run production build

```shell
   pnpm build
   pnpm start
```

## OpenAPI Document

- URL: `GET /openapi.json`

## Environment Variables

- `PORT` (optional): Port to listen on. Default `3000`.
- `LOG_LEVEL` (optional): pino log level (e.g., `info`, `debug`). Default `info`.
