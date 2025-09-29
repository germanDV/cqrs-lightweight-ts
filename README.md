# Collateral Arrangements API

## Structure

```
src/
├── transport/             # HTTP/API Layer (could include gRPC)
│   ├── controllers/
│   ├── dtos/              # Request/Response DTOs
│   └── middleware/
│
├── application/           # Use Cases Layer
│   ├── commands/
│   ├── queries/
│   └── interfaces/        # Application service contracts
│       ├── repositories/
│       └── services/
│
├── domain/                # Business Logic Layer
│   ├── entities/
│   │   └── value_objects/
│   └── services/          # Domain services (if needed)
│
├── infrastructure/        # External Concerns Layer
│   ├── repositories/      # Implementation of the application layer repositories interfaces
│   ├── database/          # DB connection, migrations, etc.
│   └── logging/
│
├── shared/                # Cross-cutting concerns
│   ├── types/
│   ├── errors/
│   └── utils/
│
├── config/
│
└── main.ts                      # Entry Point
```

## Stack

- Framework: Hono
- Runtime: Node.js (>= 22.18)
- Logging: pino (middleware)
- OpenAPI: @hono/zod-openapi (OpenAPI 3.1)
- Package Manager: pnpm (>= 10.16)

1. Install dependencies

```shell
   pnpm install
```

2. Run in dev mode (with tsx watcher)

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

- `PORT` (optional): Port to listen on.
- `LOG_LEVEL` (optional): pino log level (e.g., `info`, `debug`).
