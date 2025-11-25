# Developer & Agent Guide

This document provides standardized instructions for developers and AI agents on how to perform common operational tasks within this project.

## Project Data Store: Upstash KV

This project uses **Upstash KV** as its primary database (data store). Upstash is a serverless Redis database that stores data in a key-value format.

We use scripts (like seeds and migrations) to programmatically add, update, or modify the data stored in Upstash, such as the AI endpoint configurations. Therefore, running these scripts requires valid Upstash credentials.

## Running Scripts with Environment Variables (Seeds, Migrations, etc.)

To ensure scripts run correctly, they need access to environment variables (e.g., database credentials), which must be loaded from a `.env` file.

### Prerequisites

1.  **Create a `.env` file:** Ensure you have a `.env` file in the root of the project.
2.  **Add Upstash Credentials:** Populate this file with the necessary credentials for the Upstash KV database.

    ```
    KV_REST_API_URL="YOUR_KV_REST_API_URL"
    KV_REST_API_TOKEN="YOUR_KV_REST_API_TOKEN"
    ```

### Standard Command Pattern

To execute a TypeScript script that depends on the `.env` file, **always** use the following command pattern. This method works without requiring permanent installation of `dotenv` or `tsx`.

```bash
npx dotenv-cli -- npx tsx <path_to_your_script>
```

#### Command Breakdown:

*   `npx dotenv-cli`: Executes the `dotenv-cli` package on-the-fly. This tool reads your `.env` file and loads the variables into the environment for the command that follows.
*   `--`: A crucial separator. It tells `dotenv-cli` that its own arguments have ended and that everything following is the actual command to be executed.
*   `npx tsx`: Executes the TypeScript script using `tsx`, also run on-the-fly via `npx`.

### Examples

**1. Running the Database Seed Script:**

The seed script at `packages/beddel/tools/seed.ts` is used to populate or refresh the AI endpoint data in the Upstash database.

```bash
npx dotenv-cli -- npx tsx packages/beddel/tools/seed.ts
```

**2. Running a (Hypothetical) Migration Script:**

If you create a migration script inside `packages/beddel/tools/migrations/001-add-new-field.ts` to alter existing data, the command would be:

```bash
npx dotenv-cli -- npx tsx packages/beddel/tools/migrations/001-add-new-field.ts
```
