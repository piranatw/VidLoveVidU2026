<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Supabase-BaaS-3FCF8E?logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Deployed_on-Vercel-000?logo=vercel&logoColor=white" alt="Vercel" />
</p>

# 💕 VidLoveVidU 2026

> **"Valentine's Day Interactive Visual Novel & Personality Quiz"**  
> A web application for a Valentine's Day festival event featuring an MBTI-based personality game, event registration, and a lost & found board.

---

## ✨ Features

### 🎮 First Love Game (เกมรักแรก)
An interactive visual-novel-style personality quiz that determines your **romantic archetype** through MBTI scoring.

- **Branching storyline** — players answer questions set in a Thai high school Valentine's Day story
- **Two branching paths** — the story splits into a *Thinking Path* or *Feeling Path* based on early answers
- **8 unique archetypes**: Once & Always, Just Us, Quietly, All In, Before I Knew, Almost, Soft Place, Golden Chapter
- Scene-by-scene **narrative dialogues** with animated transitions
- Custom **positioned choices** overlaid on scene backgrounds

### 🎟️ Registration & Entry Pass
- Register as a **Student**, **Public visitor**, or **Alumni**
- Collects name, gender, phone, relationship status, and transport mode
- Students provide student ID and year
- Generates a unique digital **Entry Pass** with a Pass ID

### 🔍 Lost & Found Board
- Community board to browse **lost items** found at the festival
- Items include name, description, location, photo, and claim status
- Powered by **Supabase** for real-time data

### 🔐 Admin Panel
- Protected admin routes with password authentication
- Manage lost & found items (create, update, delete, mark as claimed)
- Admin post management

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS v4 |
| **Animations** | Framer Motion |
| **State Management** | Zustand |
| **Routing** | React Router v7 |
| **Backend / Database** | Supabase (PostgreSQL + RLS) |
| **Deployment** | Vercel (with CDN edge caching) |
| **Icons** | Lucide React |

---

## 📁 Project Structure

```
src/
├── assets/               # Bundled assets (icons, sprites, backgrounds, results)
├── components/
│   ├── auth/             # ProtectedAdminRoute
│   ├── game/             # Game engine components
│   │   ├── GameContainer.tsx
│   │   ├── StartScreen.tsx
│   │   ├── NarrativeScene.tsx
│   │   ├── QuestionScene.tsx
│   │   └── ResultScreen.tsx
│   ├── layout/           # MainLayout
│   └── CustomSelect.tsx
├── data/
│   └── scenes.ts         # All game scenes, dialogue, and choices
├── hooks/
│   └── useLockBodyScroll.ts
├── lib/
│   └── supabase/         # Supabase client, post service, DB schema
├── pages/
│   ├── Dashboard.tsx     # Home page with feature cards
│   ├── Registration.tsx  # User registration form
│   ├── Status.tsx        # Entry pass / status display
│   ├── LostAndFound.tsx  # Public lost items board
│   ├── AdminLostAndFound.tsx
│   └── AdminManagePosts.tsx
├── store/
│   ├── useGameStore.ts   # Game state, MBTI scoring, archetype calculation
│   ├── usePostStore.ts   # Lost & found post management
│   └── useUserStore.ts   # User registration state
├── types/
│   └── index.ts          # TypeScript interfaces (User, GameScene, GameResult, etc.)
├── utils/
│   ├── imageLoader.ts    # Scene image loading utilities
│   └── backgroundLoader.ts
├── App.tsx               # Routes definition
├── main.tsx              # Entry point
└── index.css             # Global styles & Tailwind imports
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/piranatw/VidLoveVidU2026.git
cd VidLoveVidU2026

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Environment Variables

Create a `.env` file in the project root with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

Run the SQL schema in your Supabase SQL Editor to create the required tables:

```bash
# The schema is located at:
src/lib/supabase/schema.sql
```

This creates:
- `registrations` table — stores user registrations
- `lost_items` table — stores lost & found entries
- Row Level Security (RLS) policies for public access

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## 🎯 Game Mechanics

The "First Love" game uses an MBTI-based scoring system:

1. **Global Phase** — 4 shared questions that all players answer
2. **Pivot** — based on accumulated T (Thinking) vs F (Feeling) scores, players branch into:
   - 🧠 **Room 1** (Thinking Path) — debate club, chess, photography
   - 💗 **Room 2** (Feeling Path) — drama, music, art, gardening
3. **Branched Phase** — 4 additional questions specific to each path
4. **Result** — MBTI type is calculated and mapped to one of 8 romantic archetypes

### Archetype Mapping

| MBTI Types | Archetype | Thai Name |
|---|---|---|
| ISTJ, ISFJ | Once & Always | รักสุดท้าย |
| INFJ, INTJ, INFP | Quietly | แอบรัก |
| ISTP | Before I Knew | เผลอใจ |
| ISFP | Soft Place | สบายใจ |
| INTP, ENTP | Almost | ไปต่อไม่ได้ |
| ESTP, ENTJ | All In | ใจกล้า |
| ESFJ | Just Us | เพื่อน |
| ESFP, ENFJ | Golden Chapter | สมหวัง |
| ENFP | Before I Knew | เผลอใจ |
| ESTJ | Soft Place | สบายใจ |

---

## 🌐 Deployment

This project is configured for **Vercel** deployment:

- `vercel.json` sets aggressive caching headers (1 year) for all image assets
- Scene backgrounds in `/public/images/scenes/` are served from CDN edge
- Bundled assets get automatic content-hash cache busting via Vite
- Manual chunks split React, Framer Motion, and Zustand for optimal loading

---

## 📄 License

This project was created for the **VidLoveVidU 2026** Valentine's Day festival event.

---

<p align="center">
  Made with 💕 for Valentine's Day 2026
</p>
