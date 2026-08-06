# LEVRRO PRD demonstration script

Use this script for a client walkthrough at `http://localhost:3000`. The backend must be running at
`http://127.0.0.1:8000` through the Next.js `/api/v1` proxy. Use synthetic data only.

Demo credentials are in `backend/demo_accounts_english.csv`. Use an account with role `user` for the user flow
and an account with role `admin` for the admin flow.

## 1. Authentication and account management

Open `/sign-in`, create an account with any valid email address and a password of at least 10 characters,
sign out, then sign back in. Refresh the page and confirm the session remains active. Open “Forgot
password?” to demonstrate the reset request screen. Email/password is the only enabled authentication
method; Google authentication is intentionally deferred.

## 2. Applications and opportunity analysis

Open **Applications → New application**, choose Job, Internship, or Scholarship, and enter a synthetic
role, organization, and opportunity description. Save it. Reopen the application and confirm the typed
requirements and target opportunity remain available. Use **Duplicate** and confirm the new application has
the opportunity and reusable answers but no copied CV, generated documents, or exports.

## 3. CV upload and extraction review

Upload a small synthetic PDF from the application workspace. Confirm the status changes from queued to
completed, review the extracted fields, edit a field, and explicitly confirm it. Uploading a non-PDF or an
oversized file should be rejected. If extraction fails, use **Retry** or the guided-question fallback.

## 4. Guided interview and reusable profile

Continue to the questions. Demonstrate a required answer, an optional skipped answer, immediate save,
backward navigation, and resume after leaving the page. Open **Settings → Career profile**, edit a profile
section, save it, and return to another application to show that confirmed profile data is reusable.

## 5. Grounded AI generation

Return to the application, complete required questions, and start generation. Show the queued/processing
state and then open the generated CV and cover letter. The backend uses Gemini 3.6 Flash; the browser never
receives the Gemini key. Unsupported opportunity requirements should not appear as invented applicant facts.

## 6. Document editor and revisions

Open a generated document. Replace a statement, add/remove/reorder a statement, change the template and
accent color, then save. Regenerate one section and verify unrelated manually edited sections remain
unchanged. Use the document library to open the same application’s saved revisions.

## 7. Preview and separate PDF exports

Open preview for the CV and cover letter. Start each export separately, poll its status, download both
PDFs, and select text from each PDF. The preview and export should show the same content and styling.

## 8. Admin question bank

Sign in with an admin account and open `/admin`. Create or clone a draft question-set version, add/edit,
activate/deactivate, reorder, and categorize a question, then publish the version. Published versions are
immutable and new conversations pin the selected published version.

## 9. Admin operations and privacy

From `/admin`, open AI usage, email delivery, and product-funnel summaries. These are aggregate views only;
raw CV text, answers, passwords, tokens, and Gemini credentials must not appear. Use Settings to demonstrate
password-confirmed account deletion only with a disposable account.

## 10. Resilience and security checks

During a disposable demo, restart the API or worker and refresh the application. Durable jobs should resume
or show a retryable failure. Check that unauthenticated requests redirect to sign-in, a normal user cannot
open `/admin`, and another user cannot access the first user’s application or documents.

## 11. Arabic, responsive, and accessibility review

Enter Arabic and English answers in the same application, resize to a 320px viewport, navigate the form
with keyboard only, and verify automatic text direction, visible focus, readable contrast, and no horizontal
overflow. These checks require human browser acceptance even though automated coverage exists.

## Evidence to record

For a client demonstration, record the release tag, browser/device, account role, screenshots of each major
workflow, and any failed/retried job. Production acceptance additionally requires the external gates listed
in `backend/docs/PRODUCTION_READINESS.md`.
