# AI Context Pack

The assistant now receives a structured context object instead of only the latest observation.

The pack contains:

- farm identity and optional location
- selected field, crop and area
- current observation and media metadata
- observation sensor readings
- weather context when available
- up to 10 previous observations for the same field
- up to 10 tasks associated with the field
- a compact knowledge query

## Adapter boundary

`buildAIContextPack()` is deliberately independent of any model provider. The same pack can be passed to a local model adapter or, when explicitly enabled, to a trusted online adapter such as the planned GWDG/RAG integration.

Media binary data is not copied into the prompt pack; only type and filename metadata are included.

## Safety of interpretation

The prompt helper instructs the assistant to distinguish observed facts, possible explanations, checks and next steps, and to express agronomic assessment as uncertain guidance rather than a definitive diagnosis.

This is a context-building layer, not a plant-diagnosis engine.
