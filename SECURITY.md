# Security Policy

Plan2Predict / LedgerFlow Studio is a public learning dashboard and sandbox. It is not designed to store production accounting data, tax records, customer personal data, bank information, or confidential company documents.

## Core rules

- Do not commit real API keys, passwords, service account files, or `.env` files.
- Store `GEMINI_API_KEY` in Google Cloud Run environment variables or secrets.
- Use only demo, synthetic, masked, or anonymized data in the public sandbox.
- Do not paste customer data, tax IDs, bank accounts, contracts, invoices, or payroll records into public prompts or demo data.
- Keep Cloud Run minimum instances at `0` and maximum instances low while the project is experimental.

## API protection

The backend includes basic protections for `/api/gemini/generate`:

- request body limit via Express JSON middleware
- maximum prompt length via `MAX_PROMPT_LENGTH`
- simple in-memory rate limit via `RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX_REQUESTS`

These are basic controls for a learning app, not enterprise-grade API security.

## Reporting security issues

For private or sensitive security issues, do not open a public GitHub issue with secrets. Rotate exposed keys immediately and redeploy the service with a new key.
