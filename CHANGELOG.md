# Changelog

## 0.6.0 - Cloud sandbox stabilization

### Added

- Interactive Tools & Simulators hub.
- Expanded Accounting Knowledge Hub for VAS, IFRS, tax, audit, and construction accounting.
- Expanded Advanced ML Lab with evaluation, forecasting, fraud detection, data engineering, leakage/bias, and pipeline sections.
- DevOps & Cloud Deployment Lab.
- Project Control & QA Lab inside DevOps Lab.
- Release Notes Generator.
- Security policy.
- Standard `.env.example` for Cloud Run and Gemini API configuration.

### Changed

- Renamed package to `plan2predict-ledgerflow-studio`.
- Set project version to `0.6.0`.
- Made the Express server more Cloud Run friendly.

### Security

- Added basic prompt length validation.
- Added simple in-memory rate limiting for `/api/gemini/generate`.
- Added clearer guidance for API key and demo data handling.
