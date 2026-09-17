# KlarblattFarm MVP

## Product flow

**Observe → Context → Assist → Act**

The first vertical slice is:

**Today → Walk → New Observation → Save offline → Observation Detail → Create Task**

## Scope

- Farm and field context
- Offline-first observations
- Photo / voice / text references
- Tasks linked to observations
- JSON export
- Local AI adapter boundary
- Optional integrations for weather, sensors and farmOS

## Observation context object

An observation should be treated as a context object rather than only a photo. The conceptual fields are:

- id
- farmId
- fieldId
- timestamp
- location
- text
- voice/media references
- photos
- sensor readings
- weather context
- priority/status
- task linkage
- AI findings

## AI Context Pack

When AI is enabled, combine the relevant field, observation, image, sensor, weather, history and farm knowledge into a Context Pack. The assistant should return structured findings with uncertainty and avoid presenting a definitive agronomic diagnosis.

## Architecture direction

```text
Mobile/Web UI
      ↓
Application layer
      ↓
Farm domain
      ↓
Offline local storage
      ↓
Adapters
  ├── Weather
  ├── Sensors / LoRaWAN
  ├── farmOS
  └── AI runtime
```

## Explicit non-goals for MVP

Do not start with drones, satellite analytics, many sensor types, custom hardware, a complex ERP, or automatic plant diagnosis. Those can become later adapters or research tracks.
