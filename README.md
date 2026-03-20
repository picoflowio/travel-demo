## Overview
Lightweight travel-planning flow built with picoflow's Purposeful Chatbot engine. The TravelFlow orchestrates planner, flight, hotel, activity, and synthesizer steps to propose a simple itinerary — no hotel-brand pricing simulation or heavy business logic from the hotel-demo repo.

## Quick start
- Copy env template: `cp .env-example .env` and fill in your keys (OpenAI/Gemini/Anthropic + PICOFLOW_KEY). Choose your document DB driver.
- Install deps: `yarn install`
- Run locally: `yarn start` (builds then watches) or `yarn start:dev` for hot reload.
- Open API docs: http://localhost:8000/api

## Calling the flow
POST `http://localhost:8000/ai/run`

Headers
- `CHAT_SESSION_ID` – omit on the first call; reuse the value returned in the response header for follow-up turns.

Body
```json
{
  "flowName": "TravelFlow",
  "message": "Plan a 5-day trip to Lisbon in June with flights, hotel and a couple of activities",
  "config": {}
}
```

To close a conversation: POST `http://localhost:8000/ai/end` with `CHAT_SESSION_ID` in the headers.

## Environment variables
Values live in `.env-example` (copy to `.env`).

```text
PICOFLOW_KEY=
GEMINI_KEY=
OPENAI_KEY=
ANTHROPIC_KEY=

LLM_RETRY=3
LLM_TEMPERATURE=0.2
SESSION_EXPIRATION=50000

DOCUMENT_DB=COSMO
# DOCUMENT_DB=MONGO

COSMODB_KEY=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnZ0a==
COSMODB_URL=http://localhost:8081/
COSMODB_ID=picoflow
COSMODB_SESSION_ID=sessions

# For MongoDB
MONGODB_NAME=picoflow
MONGODB_COLLECTION=sessions
MONGODB_URL=mongodb://localhost:27017/?directConnection=true
```

## Data store
Use a single collection/table named `sessions` in either the Cosmos DB emulator or MongoDB. Local or cloud instances both work.

## License key
Request a trial `PICOFLOW_KEY` at `dev@picoflow.io`.

