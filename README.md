## Aegis Trade Intelligence Platform

Aegis is an institutional-grade trading intelligence stack that ingests order-flow artifacts, orchestrates AI decision agents, and coordinates execution across multi-broker accounts. This repository contains the Next.js control plane, REST APIs, websocket gateway, background workers, and Prisma data access layer.

### Core Capabilities
- **Secure Access Control:** JWT-protected API surface with hashed credentials, operator provisioning workflow, and audit logging.
- **Order-Flow Ingestion Pipeline:** Authenticated REST endpoint that persists normalized payloads, deduplicates by hash, and enqueues processing jobs on Redis-backed BullMQ.
- **Agentic Decision Engine:** LangChain + OpenAI orchestrator converts raw order flow into risk-scored trade signals with structured metadata.
- **Operational Dashboard:** React/Next.js console renders account telemetry, equity curves, risk exposure, and live signal feeds backed by React Query.
- **Long-Term Memory Hooks:** Vector-store module ready for Qdrant / MemoryVectorStore to archive session context and enable semantic recall.
- **Background Workers:** Dedicated worker process converts queued order-flow events into trade signals and system logs.

### Project Structure
```
trading-ai-assistant/
├── prisma/             # Prisma schema & seed script
├── src/
│   ├── app/            # Next.js App Router (UI + API routes)
│   ├── components/     # UI components & providers
│   ├── lib/            # Auth, queue, AI, memory helpers
│   └── workers/        # BullMQ worker entrypoints
├── public/             # Static assets
└── package.json
```

### Required Infrastructure
- PostgreSQL / TimescaleDB instance (`DATABASE_URL`)
- Redis deployment for BullMQ (`REDIS_URL`)
- OpenAI API key (`OPENAI_API_KEY`)
- Optional: Qdrant / Weaviate if you swap the in-memory vector store for production

### Getting Started
```bash
cp .env.example .env
# update secrets, database URLs, and API keys

npm install
npm run prisma:generate
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts

npm run dev
```
Run the order-flow worker in a separate terminal:
```bash
npm run worker:orderflow
```

### Deploying to Vercel
1. Configure Environment Variables in Vercel Project Settings.
2. Provision Redis (Upstash, Elasticache, etc.) and PostgreSQL (Neon, Supabase, RDS).
3. Deploy via CLI:
   ```bash
   vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-0da319b6
   ```

### API Overview
- `POST /api/auth/register` – Create operator account (admin-only in production).
- `POST /api/auth/login` – Return JWT token.
- `GET /api/accounts` – List broker accounts and telemetry.
- `POST /api/accounts` – Register account endpoint.
- `POST /api/orderflow` – Ingest order-flow snapshot and enqueue processing job.
- `GET /api/signals` – Paginated list of AI-generated signals with order-flow context.
- `GET/POST /api/signals/{id}` – Retrieve signal or append manual decisions.
- `GET /api/ws` – Websocket channel for low-latency ingestion acknowledgements.
- `GET /api/health` – Basic health probe for uptime monitors.

### Operational Notes
- Prisma client is singleton-scoped for serverless compatibility.
- BullMQ queue uses exponential backoff and retains history for observability.
- LangChain agent uses structured output parser to guarantee deterministic JSON.
- Frontend persists JWT + user profile in localStorage and rehydrates client state.
- Equity curve, risk cards, and signal feed automatically hydrate with React Query.

### Testing & Hardening TODOs
- Integrate CI pipeline with linting, Prisma migration checks, and unit tests.
- Swap MemoryVectorStore with managed vector DB for production-grade recall.
- Extend websocket gateway with JWT validation and multiplexed topic streams.
- Implement granular RBAC scopes on API keys and signed webhooks for brokers.
