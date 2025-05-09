# Logistics Microservice

## Functional Scope (API Endpoints)

- **`POST /deliveries`**:
  - Accepts an order payload
  - Selects a shipping provider (randomly or using simple logic)
  - Requests label generation from the selected provider
  - Returns the printable shipping label
- **`GET /deliveries/:id/status`**:
  - Returns the latest known delivery status from the database
  - Implement asynchronous status updates:
    - **Polling (NRW):** Fetch updates from NRW's API every hour (simulated scheduled background task)
    - **Webhooks (TLS):** Handle incoming webhook calls from TLS to update status (simulated route for provider callbacks)
