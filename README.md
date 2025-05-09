## Objective

You are required to build a **backend microservice** to manage logistics operations. This service will interact with multiple mocked shipping providers (**NRW** and **TLS**). Each provider exposes its APIs with different data formats and mechanisms for status updates.

## Functional Requirements

### Your microservice must:

- Handle **delivery creation requests** for a given order and generate a **printable shipping label** returned in the response.
- Allow querying the **real-time status** of any delivery.
- Use a **non-relational database** (e.g., MongoDB, DynamoDB, etc.) for persistence.

## Requirements

### 1. Architecture & Code Design

- Apply **Hexagonal Architecture** (Ports & Adapters).
- Apply **Domain-Driven Design** principles.
- Implement a **microservice** in TypeScript using Node.js (framework of your choice).
- Each provider (**NRW**, **TLS**) must be implemented behind an **abstraction layer**. The service should integrate with all of them through a **common interface**, despite their differences.

### 2. Functional Scope

Implement the following endpoints:

#### **POST /deliveries**

- Accepts an order payload and:
  - Selects a provider (randomly or based on simple logic),
  - Requests label generation from the selected provider,
  - Returns the label to the user.

#### **GET /deliveries/:id/status**

- Returns the latest known delivery status from your database.
- Status updates must be processed **asynchronously** based on the provider’s mechanism:

  - **Polling-based providers** (e.g., NRW): Fetch updates from the provider’s API every hour.
  - **Webhook-based providers** (e.g., TLS): Handle incoming webhook calls from the provider to update delivery status.

- You must **simulate both mechanisms** in your solution:
  - For **webhooks**, implement a route that accepts provider callbacks.
  - For **polling**, implement a **scheduled background task**.

### 3. Persistence

- Use a **non-relational database** to persist delivery data and status.
- Clearly structure your **data models** using appropriate **repository patterns**.

### 4. Testing

- Include **unit tests** for core domain logic (100% coverage is not needed).
- [Optional] Include **integration tests** for API endpoints and provider interfaces.

### 5. [Optional] Documentation

- Integrate **auto-generated API documentation** using OpenAPI (Swagger or similar).
- Provide an **overview of the architecture** (ideally with a diagram).
- Include **example payloads** and **curl/Postman** commands to test endpoints.

## Deliverables

A GitHub repository containing:

- The **project code**.
- A **README.md** that includes:
  - Setup instructions to run the service locally (using Docker or similar).
  - How to trigger and test the **asynchronous status update flows** (polling and webhooks).

## Evaluation Criteria

- Clear application of **DDD** and **Hexagonal Architecture**.
- Clean, modular, and testable code.
- Quality of **abstraction across providers**.
- Correct simulation of **polling** and **webhook** mechanisms.
- Appropriate use of **non-relational persistence**.
- Proper **documentation** and setup instructions.
- Functional **delivery creation** and **real-time status tracking**.
