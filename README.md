# Otium 🌿

AI-powered platform that helps you discover, explore, and master your hobbies and interests.

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

1. Install dependencies:
```bash
cd otium-app/web
npm install
```

2. (Optional) Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=your-key-here
```
The app works with mock data if no key is set.

3. Start the dev server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Vercel AI SDK
- Lucide Icons

## Structure
- `/src/app/page.tsx` — Landing page
- `/src/app/signup` — Sign up page
- `/src/app/login` — Login page  
- `/src/app/app` — Main app (AI chat + interest tabs)
- `/src/app/api/chat` — Chat API route
- `/src/components/` — UI components
- `/src/lib/` — Utilities and AI config
- `/src/types/` — TypeScript types
