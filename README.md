# Upload Server

A RESTful API for image uploading, storage, and management. Files are stored on **Cloudflare R2** (S3-compatible) and metadata is persisted in **PostgreSQL**.

## Features

- Upload images (JPEG, PNG, WebP) with a 2 MB size limit
- List uploads with full-text search, sorting, and pagination
- Export uploads as a CSV report streamed directly to Cloudflare R2
- Auto-generated OpenAPI documentation at `/docs`
- Functional error handling with a custom `Either` type

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework | Fastify 5 |
| Database | PostgreSQL + Drizzle ORM |
| Storage | Cloudflare R2 (AWS S3 SDK) |
| Validation | Zod + fastify-type-provider-zod |
| Testing | Vitest |
| Linting / Formatting | Biome |
| Package Manager | pnpm |

## Prerequisites

- Node.js 20+
- pnpm 10+
- Docker (for local PostgreSQL)
- A Cloudflare R2 bucket with API credentials

## Getting Started

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd upload-server
pnpm install
```

### 2. Configure environment variables

Copy the example below and save it as `.env`:

```env
PORT=3333
NODE_ENV=development

DATABASE_URL=postgresql://docker:docker@localhost:5432/upload

CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_ACCESS_KEY_ID=
CLOUDFLARE_SECRET_ACCESS_KEY=
CLOUDFLARE_BUCKET=
CLOUDFLARE_PUBLIC_URL=
```

### 3. Start the database

```bash
docker-compose up -d
```

### 4. Run database migrations

```bash
pnpm db:migrate
```

### 5. Start the development server

```bash
pnpm dev
```

The server will be available at `http://localhost:3333`.
Interactive API docs are available at `http://localhost:3333/docs`.

## API Reference

The API is fully documented via OpenAPI (Swagger). Once the server is running, open your browser at:

```
http://localhost:3333/docs
```

You can explore all endpoints, inspect request/response schemas, and execute requests directly from the UI.

## Building for Production

The project uses [tsup](https://tsup.egoist.dev) to bundle the TypeScript source into ESM output.

```bash
pnpm build
```

The compiled files are written to the `dist/` directory. The build entry covers the entire `src/` tree, so the output mirrors the source structure.

To start the compiled server:

```bash
node dist/infra/http/server.js
```

> **tsup config** ([tsup.config.ts](tsup.config.ts)): entry `src/**/*.ts`, format `esm`, output `dist/`, `clean: true` (wipes `dist/` before each build).

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Compile TypeScript to `dist/` via tsup |
| `pnpm test` | Run tests once |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm db:generate` | Generate a new Drizzle migration |
| `pnpm db:migrate` | Apply pending migrations |
| `pnpm db:studio` | Open Drizzle Studio |

## Testing

Tests are colocated with their source files as `.spec.ts` and use a dedicated `upload_test` database.

Create a `.env.test` file:

```env
NODE_ENV=test
DATABASE_URL=postgresql://docker:docker@localhost:5432/upload_test

CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_ACCESS_KEY_ID=
CLOUDFLARE_SECRET_ACCESS_KEY=
CLOUDFLARE_BUCKET=
CLOUDFLARE_PUBLIC_URL=
```

Then run:

```bash
pnpm test
```

Migrations for the test database are applied automatically before each test run.

## CI/CD

A GitHub Actions workflow runs the full test suite on every pull request targeting `main`. It spins up a PostgreSQL 13 service container, installs dependencies, and executes `pnpm test`.

See [.github/workflows/tests.yml](.github/workflows/tests.yml) for details.
