# ⚽ FIFA Predictor — World Cup Forecast Platform (1930–2026)

A modern, data-driven FIFA World Cup prediction platform built with Next.js, React, TypeScript, Tailwind CSS, and the Web Audio API.

## ✨ Features

- **17 Interactive Sections**: Historical Database, Prediction Engine, Monte Carlo Simulator, Team Analysis, Head-to-Head Predictor, Historical Trends, Player Analytics, Player Compare, Interactive World Map, Prediction Dashboard, Records & Milestones, Advanced Simulator (v2), What-If Simulator, Football Analyst Chat, World Cup Quiz, Admin Panel, Creator Credits
- **Real World Map**: Interactive map with actual country geometries (d3-geo + TopoJSON)
- **Real Country Flags**: High-quality flag images from flagcdn.com
- **Live Data**: Real-time news feed + LLM-powered match insights + conversational analyst
- **Background Music**: 7-minute World Cup mashup (6 songs with crossfades) playing automatically
- **Dark Luxury Theme**: Gold (#D4AF37) + FIFA Blue (#0066FF) + Neon Blue (#00E1FF) on black
- **Real FIFA 2026 Logo**: Official-style logo in the hero
- **Responsive**: Mobile-first design

## 🎵 Background Music Mashup

| Time | Song | Artist |
|------|------|--------|
| 0:00–1:15 | Wavin' Flag | K'NAAN |
| 1:15–2:30 | Waka Waka | Shakira |
| 2:30–3:40 | We Are One (Ole Ola) | Pitbull feat. J.Lo |
| 3:40–4:45 | La La La (Brazil 2014) | Shakira feat. Carlinhos Brown |
| 4:45–5:50 | World Cup (Champions) | IShowSpeed |
| 5:50–7:00 | Dai Dai | Shakira feat. Burna Boy |

## 🛠 Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Charts**: Recharts (bar, pie, radar, area, scatter, line)
- **Maps**: d3-geo + topojson-client
- **Animations**: Framer Motion
- **Audio**: HTML5 Audio API with crossfading
- **AI**: z-ai-web-dev-sdk (LLM + web search)
- **Icons**: Lucide React

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/fifa-predictor.git
cd fifa-predictor

# Install dependencies
npm install
# or
bun install

# Run development server
npm run dev
# or
bun run dev

# Open http://localhost:3000
```

## 📁 Project Structure

```
fifa-predictor/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main page (assembles all sections)
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Dark luxury theme
│   │   └── api/
│   │       ├── analyst-chat/     # Conversational analyst endpoint
│   │       ├── match-insight/    # LLM match prediction endpoint
│   │       └── live-news/        # Web search news endpoint
│   ├── components/
│   │   ├── fifa/                 # Navbar, Footer, Flag, Trophy, MashupPlayer, etc.
│   │   ├── sections/             # 17 page sections
│   │   └── ui/                   # shadcn/ui components
│   └── lib/
│       ├── data/                 # Teams, tournaments, players data
│       ├── ml/                   # ELO, features, models, simulator-v2
│       ├── ai/                   # LLM insight + news services
│       ├── geo/                  # World map + host cities
│       └── worker/               # Web Worker for parallel simulations
├── public/
│   ├── 2026-fifa-logo.png        # FIFA 2026 logo
│   └── audio/                    # 6 MP3 mashup files
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── .gitignore
```

## 👥 Created By

- **OM SAI SAINI**
- **ARHAAM SETHIA**

## 📄 License

This project is for educational and analytical purposes only.
