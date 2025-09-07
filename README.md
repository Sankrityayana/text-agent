This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Create an `.env.local` file with your Google Gemini API key:

```
GEMINI_API_KEY=your_api_key_here
```

Then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Open `http://localhost:3000` and use the UI to upload a PDF/DOCX/TXT or paste text, then click "Process" to generate the JSON output. The API route is available at `POST /api/process` and accepts `multipart/form-data` (fields: `file`, optional `text`) or JSON `{ text: string }`.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Project Structure

- `src/app/page.tsx`: Frontend UI for upload and results display
- `src/app/api/process/route.ts`: API route for text extraction and Gemini summarization
- `src/lib/extractors.ts`: Utilities for PDF/DOCX/TXT extraction and cleanup
- `src/lib/gemini.ts`: Google Gemini client wrapper for summarization
- `src/types/index.ts`: Shared types

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
