# LEVRRO MVP PRD frontend traceability

This document maps the user-facing implementation to `../../backend/LEVRRO_MVP_PRD.pdf`
(v0.3). The backend's endpoint-level evidence is maintained separately in
`../../backend/docs/PRD_TRACEABILITY.md`.

Status meanings:

- **Implemented and browser verified**: implemented in the production frontend path and covered by
  automated Chromium tests.
- **Implemented; release QA required**: code and API integration exist, but acceptance requires the
  exact deployed release, real providers, or human visual/language testing.
- **Product-owner constraint**: deliberately retained because of an explicit product-owner request.

## Core user journey

| PRD area | Status | Frontend evidence |
|---|---|---|
| Landing, account creation, sign-in/out | Implemented and browser verified | Existing GitHub landing/sign-in design is retained. Email registration/login use the backend session API. |
| Password reset and account deletion | Implemented and browser verified | `/forgot-password`, `/reset-password`, and password-confirmed deletion in Settings. Real reset email is a release QA gate. |
| Application types | Implemented and browser verified | New application supports job, internship, and scholarship and sends the selected closed API value. |
| Reopen and duplicate applications | Implemented and browser verified | Every saved application has Open, Duplicate, and Delete/Undo actions. |
| Opportunity capture and analysis | Implemented and browser verified | Application workspace stores role, organization, and pasted description and displays categorized requirements. |
| PDF upload and extraction | Implemented and browser verified | PDF-only input, status display, editable field-by-field review, explicit confirmation, failure retry, and start-from-scratch guidance. |
| Conditional guided interview | Implemented and browser verified | Required/optional labels, all API question types, progress, immediate save, skip, prior-answer editing, and resume on reopen. |
| Reusable career profile | Implemented and browser verified | Settings exposes all PRD profile sections and revision-protected persistence. Arabic/English text fields use automatic direction. |
| Grounded generation | Implemented; release QA required | Generation is gated on opportunity plus required questions, shows queued/processing/failed/completed state, and loads the two saved documents. Live Gemini grounding/evaluation remains a release gate. |
| Document editor | Implemented and browser verified | Statement add/remove/reorder through one-line-per-statement editing, save-on-blur, explicit save, single-section regeneration, two templates, accessible accent palette, and live backend preview. |
| Document library and versions | Implemented and browser verified | Library aggregates real application-scoped backend documents; generated records open in the production editor. Backend revisions preserve versions. |
| Separate PDF exports | Implemented; release QA required | Each CV/cover letter starts and polls an independent durable export, then downloads the result. Final Chromium/font/object-storage output needs staging evidence. |
| Admin question bank | Implemented and browser verified | Admin overview, create/clone version, add/edit/remove/reorder questions, required/active toggles, all types, profile categorization, conditional rules, publish, and immutable published versions. |
| Admin operations and user journey preview | Implemented; release QA required | Admin accounts route directly to `/admin`; aggregate AI usage, mail delivery, funnel summaries, user list, and safe per-user journey milestones are integrated. Raw CV/answer content and private files are not exposed. |

## Non-functional acceptance

| Requirement | Status | Remaining release evidence |
|---|---|---|
| Responsive and keyboard usable | Implemented; release QA required | Automated Chromium coverage exists; complete 320 px/mobile-device and keyboard-only acceptance is still required. |
| Arabic/RTL usable | Implemented; release QA required | User-entered evidence uses `dir="auto"`; bilingual content and PDF layout need human Arabic QA with live Gemini. |
| Privacy-safe frontend | Implemented | The client sends only typed API bodies; it does not log CV text, answers, or opportunity descriptions. |
| Retry and conflict behavior | Implemented; release QA required | UI exposes extraction, generation, regeneration, and export retry states. Staging outage/conflict drills remain. |
| Portable deployment | Implemented; release QA required | Frontend depends only on the OpenAPI contract and same-origin `/api` path, allowing VPS now and AWS/GCP later. |

## Product-owner constraint

The landing page remains the exact GitHub design requested by the product owner. Its legacy marketing
copy mentions three CV templates, while the PRD production generation path intentionally offers two
(`classic` and `modern`). The functioning product path follows the PRD. Changing the landing copy is
held until the product owner explicitly authorizes a landing-page content edit.

## Automated evidence

- `npm run typecheck`
- `npm run lint`
- Complete Chromium suite: 40 passed and 2 intentionally skipped roadmap tests
- Backend: Ruff, mypy, optional-answer unit/API regressions, and committed OpenAPI drift check

The product is not considered production-launched until the external gates in
`../../backend/docs/PRODUCTION_READINESS.md` have dated evidence for the exact release tag.
