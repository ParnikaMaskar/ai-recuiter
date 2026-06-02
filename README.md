# PrepWise (AI Interview Practice)

An AI-powered mock interview web app built with **Next.js (App Router)**. Users can:
- Create job interview practice sessions (role, level, tech stack, question focus)
- Take interviews using **Vapi** voice workflows
- Get structured **AI feedback** (scores, strengths, and improvement areas) powered by **Gemini**
- Sign up / sign in using **Firebase Auth** and store interview + feedback data in **Firestore**

---

## Features

- **Authenticated dashboard** (interviews created by you + other available interviews)
- **Interview generation** via `/api/vapi/generate` (Gemini generates questions)
- **Voice interview** via Vapi workflows
- **Auto-feedback generation** after the call ends
- **Feedback breakdown page** with per-category scores and comments

---

## Tech Stack

- Next.js 15 + React 19 (TypeScript)
- Tailwind CSS (with shadcn/ui-style components)
- Firebase Admin / Firestore
- Firebase Auth (client-side)
- Vapi Web SDK for voice calls
- AI SDK + Gemini model (`gemini-2.0-flash-001`)

---

## Prerequisites

- Node.js (version compatible with your Next.js setup)
- A Firebase project with:
  - Firestore enabled
  - Firebase Auth enabled
  - Service account credentials for Admin SDK
- Vapi account + a workflow ID configured for your interview
- Gemini access via the AI SDK (handled by environment variables)

---

## Environment Variables

Create a `.env.local` file in the project root with the following variables.

### Firebase (Admin)
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` (use the escaped `\n` format if copying from the JSON)

### Vapi (Web)
- `NEXT_PUBLIC_VAPI_WEB_TOKEN`
- `NEXT_PUBLIC_VAPI_WORKFLOW_ID`

> The app uses `NEXT_PUBLIC_VAPI_*` in client components, so these must be present.

---

## Installation

```bash
npm install
```

---

## Development

```bash
npm run dev
```

Open:
- http://localhost:3000

---

## Routes / Key Pages

- `/` — Dashboard (shows your interviews + other available interviews)
- `/interview` — Interview generation / start page
- `/interview/[id]` — Voice interview page (Vapi)
- `/interview/[id]/feedback` — AI feedback breakdown
- `/sign-in` and `/sign-up` — Auth pages

---

## How It Works (High-level)

1. **Generate questions**: `POST /api/vapi/generate` calls Gemini to create a JSON array of questions and stores a finalized interview in Firestore.
2. **Start voice call**: `components/Agent.tsx` starts a Vapi workflow.
3. **Collect transcript**: the client listens for Vapi transcript messages (final) and stores them locally.
4. **Generate feedback**: after the call ends, `createFeedback` uses Gemini + a Zod schema (`feedbackSchema`) to produce:
   - overall score
   - category scores
   - strengths
   - areas for improvement
5. **Persist**: feedback is saved in the `feedback` Firestore collection.

---

## Firestore Collections (inferred)

- `users`
  - `name`, `email`
- `interviews`
  - `role`, `type`, `level`, `techstack[]`, `questions[]`, `userId`, `finalized`, `coverImage`, `createdAt`
- `feedback`
  - `interviewId`, `userId`, `totalScore`, `categoryScores`, `strengths`, `areasForImprovement`, `finalAssessment`, `createdAt`

---

## Scripts

- `npm run dev` — start dev server
- `npm run build` — build for production
- `npm run start` — run production build
- `npm run lint` — lint

---

## Notes

- Firebase Admin requires correct handling of `FIREBASE_PRIVATE_KEY` line breaks (`.replace(/\n/g, '\n')` in `lib/firebase/admin.ts`).
- If Vapi workflow variables differ, update the payload in `components/Agent.tsx` accordingly.

