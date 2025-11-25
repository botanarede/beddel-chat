# Opal Support App

A Next.js app that manages API clients and dynamic endpoints, with a secure GraphQL endpoint to execute registered methods. Upstash Redis (via @upstash/redis) is the data store.

## Quickstart

Prerequisites:
- Node.js 18+
- Upstash Redis credentials

1. Install dependencies

```bash
pnpm install
```

2. Configure environment

Create a `.env` file in the project root:

```
KV_REST_API_URL="YOUR_KV_REST_API_URL"
KV_REST_API_TOKEN="YOUR_KV_REST_API_TOKEN"
```

3. Run the dev server

```bash
pnpm dev
```

Open http://localhost:3000

4. Seed example data (optional)

```bash
npx dotenv-cli -- npx tsx scripts/seed.ts
```

5. Run Storybook (optional)

```bash
pnpm storybook
```

6. OpenAPI spec

See `openapi.yaml` for the complete API specification including curl examples.

## Testing

```bash
pnpm test
```
