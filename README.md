# MindfulTrack

**MindfulTrack** is a sleek and intuitive mental health tracker designed to help users monitor their emotional well-being over time. Built with **Next.js**, **Supabase**, and **Framer Motion**, it offers mood logging, historical insights, AI-generated suggestions, and a stylish, responsive interface.

## Features

- **Log Daily Mood**  
  Record how you're feeling each day with a mood selector and optional notes.

- **Mood Trends & History**  
  Visualize your emotions across the week with interactive charts and logs.

- **AI Response Section**  
  Get dynamic suggestions or encouragement based on your recent moods.

- **Supabase Auth & Data**  
  Secure login, mood history storage, and real-time syncing with Supabase.

- **Animated UI**  
  Smooth transitions and a beautiful layout using Tailwind CSS + Framer Motion.

---

## Tech Stack

| Category        | Technology           |
|----------------|----------------------|
| Frontend       | Next.js, React, Tailwind CSS |
| Animations     | Framer Motion        |
| Backend        | Supabase (Database & Auth) |
| Hosting        | Vercel               |

---

## Installation & Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/your-username/mindfultrack.git
cd mindfultrack

# 2. Install dependencies
npm install

# 3. Create `.env.local` with Supabase keys
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# 4. Run development server
npm run dev
```

Open http://localhost:3000 to view it in your browser.


