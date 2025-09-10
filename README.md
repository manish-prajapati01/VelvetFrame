<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

### VelvetFrame

Created by Manish.

An AI-powered web app that transforms your photo into a cinematic still while preserving identity and structure. Built with React, Vite, TypeScript, Tailwind CSS (CDN), and the Gemini API via `@google/genai`.

---

## Prerequisites

- Node.js 18+ (LTS recommended)
- A Gemini API key

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Add your API key in a `.env.local` file at the project root:
   ```env
   GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open the app: `http://localhost:5173`

## Environment Variables

- `GEMINI_API_KEY`: Your Gemini API key. The key is injected at build time via `vite.config.ts` and read by `services/geminiService.ts`.

## Features

- Upload an image (PNG, JPG, WEBP) via click or drag-and-drop
- AI transform to a cinematic look (Gemini 2.5 image preview model)
- Side-by-side original vs. result view
- Download the generated image
- Graceful retry on quota (429) responses with server-provided backoff

## Responsive Design

The UI is responsive out of the box using Tailwind utility classes:

- Layout scales from single-column on small screens to two-column comparison on medium screens and above (`grid-cols-1 md:grid-cols-2`).
- Text and spacing adapt across breakpoints (`sm:`, `md:` classes in headings, paddings, and widths).
- Upload area and images use fluid widths (`w-full`) with constrained containers (`max-w-5xl`) and safe image sizing (`object-contain`).

Tested behaviors:

- Small screens (mobile):
  - Single-column layout
  - Buttons, headers, and paddings adjusted for readability
  - Images fit within viewport width without overflow
- Medium/large screens (tablet/desktop):
  - Two-column comparison grid
  - Wider container and increased typography scale

If you notice any overflow on extremely narrow screens, reduce the uploader height in `components/ImageUploader.tsx` by adjusting the `h-64` class to a smaller utility (e.g., `h-48`). No other changes are required.

## Usage

1. Click or drag-and-drop an image into the upload card.
2. Click “Make it Cinematic”.
3. Wait for processing; when complete, compare the result and optionally download it.

## Troubleshooting

- Invalid API key (400 / API_KEY_INVALID):
  - Ensure `.env.local` contains a valid `GEMINI_API_KEY` and restart the dev server.
- Quota exceeded (429 / RESOURCE_EXHAUSTED):
  - The app waits and retries once using the server’s suggested delay. If it still fails, reduce request frequency or review quota/billing: `https://ai.google.dev/gemini-api/docs/rate-limits`.
- Env changes not applied:
  - Stop the dev server (Ctrl+C) and run `npm run dev` again.

## Scripts

- `npm run dev`: Start Vite dev server
- `npm run build`: Production build
- `npm run preview`: Preview the production build

## Tech Stack

- React 19, TypeScript, Vite 6
- Tailwind CSS (CDN)
- `@google/genai` (Gemini API)

## Notes

- The app uses `index.html` with Tailwind CDN; no local Tailwind build step is required.
- The model used is `gemini-2.5-flash-image-preview` and returns image data which is displayed and downloadable.
