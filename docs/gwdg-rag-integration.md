# GWDG RAG integration

## Architecture

FarmVisite remains offline-first:

1. local observation storage
2. local assistant by default
3. optional trusted backend/local gateway
4. GWDG Arcana/RAG only when the user explicitly selects the online mode

The GWDG adapter receives the same `AIContextPack` used by the local assistant. This keeps the provider boundary stable.

## Request

The adapter uses GWDG's OpenAI-compatible chat completions endpoint with an Arcana context and the recommended `qwen3-30b-a3b-instruct-2507` model. Temperature and top-p are set to the low values recommended in the current GWDG Arcana documentation.

## Data boundary

Do not send farm data online implicitly. The online adapter must be explicitly enabled.

Arcana is server-side indexed and persistent until explicit deletion according to GWDG's current privacy documentation. That makes Arcana suitable for curated knowledge collections, but it should not automatically become the store for private farm observations.

A future production gateway should therefore:
- whitelist which context fields may leave the device
- redact unnecessary identifiers/media
- require explicit online consent
- keep API keys server-side
- log only operational metadata needed for debugging
- provide a clear offline fallback

## Sources

GWDG Arcana API: https://docs.hpc.gwdg.de/services/ai-services/arcana/api-usage/index.html
GWDG SAIA API: https://docs.hpc.gwdg.de/services/saia/index.html
GWDG Arcana privacy: https://docs.hpc.gwdg.de/services/ai-services/arcana/data-privacy.de/index.html
