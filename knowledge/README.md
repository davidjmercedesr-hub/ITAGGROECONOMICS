# KlarblattFarm knowledge adapter

This directory contains the interface boundary for farm knowledge retrieval.

## GWDG

GWDG Arcana/RAG is an optional online retrieval adapter. The browser MVP does not embed API keys. Configure credentials only in a trusted backend or local environment.

The adapter contract is intentionally small:

- `retrieve(query, context)` → relevant knowledge chunks with source metadata
- `generate(contextPack)` → structured assistant output

See `docs/klarblattfarm-mvp.md` for the product architecture.
