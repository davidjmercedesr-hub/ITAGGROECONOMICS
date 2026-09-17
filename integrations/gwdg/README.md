# GWDG Arcana/RAG adapter

This integration is intentionally backend-only.

The web/mobile frontend must not contain a GWDG API key. A trusted backend or local service should call the adapter and expose only the minimum result needed by the app.

Current GWDG documentation exposes Arcana through:

- `https://chat-ai.academiccloud.de/v1/arcanas/api/v1/` for Arcana management
- `https://chat-ai.academiccloud.de/v1/chat/completions` for model inference with an `arcana` context

The current GWDG documentation recommends `qwen3-30b-a3b-instruct-2507` for consistent tool/RAG use. GWDG states that Arcana indexes are persistent until explicitly deleted, so farm-specific material should only be uploaded when that storage model is acceptable.

Keep the API key in a trusted backend/local environment, never in browser code or committed configuration.
