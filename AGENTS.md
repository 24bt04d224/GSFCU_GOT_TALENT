# GSFCU Got Talent — Master Project & Agent Guidelines

## 1. Project Overview & Context
- **Project Name**: GSFCU Got Talent 2026 (Navratri Special Edition)
- **Repository**: `https://github.com/Maanpatel8436/GSFCU_GOT_TALENT.git`
- **Master Workspace Integration**: Connected with Master Folder workflow for centralized management, tracking, and future feature rollouts.
- **Tech Stack**:
  - **Frontend**: React 19, Vite, Tailwind CSS v4, GSAP (GreenSock), Canvas Confetti, Lucide React
  - **Routing**: `react-router-dom` v7
  - **Linter**: Oxlint

---

## 2. Directory Structure & Architecture
```
GSFCU_GOT_TALENT/
├── public/                 # Static assets (favicons, logos, media)
├── src/
│   ├── assets/             # Images, vector icons, illustrations
│   ├── components/         # Reusable UI primitives (Navbar, Footer, Backgrounds, Badges)
│   ├── data/
│   │   └── eventData.js    # Single Source of Truth for event info, schedules, rules, categories
│   ├── pages/
│   │   ├── LandingPage.jsx # Main promotional & informational hub
│   │   └── RegisterPage.jsx# Multi-step talent registration form with validations & feedback
│   ├── sections/           # Modular landing page sections (Hero, Categories, FAQ, Rules, etc.)
│   ├── App.jsx             # Top-level routing & layout wrappers
│   ├── index.css           # Global Tailwind & design system theme definitions
│   └── main.jsx            # React root entry point
├── AGENTS.md               # AI & developer operational guidelines (This file)
├── PROJECT_GUIDELINES.md   # Architectural, integration, and synchronization guide
├── vite.config.js          # Vite build & bundler configuration
└── package.json            # Node.js dependencies and script definitions
```

---

## 3. Data & State Management Principles
1. **Single Source of Truth**:
   - All event information, deadlines, categories, FAQs, and contact links MUST be defined in `src/data/eventData.js`.
   - Never hardcode dates or event rules directly inside presentation components without referencing `eventData.js`.
2. **Form Management & State**:
   - [RegisterPage.jsx](file:///c:/Users/lenovo/Desktop/gsfcu%20got%20talent/src/pages/RegisterPage.jsx) uses a multi-step workflow (Step 1: Student Details, Step 2: Act Details, Step 3: Confirmation).
   - Any backend integration (Firebase, Supabase, REST API) should map cleanly to the state schema defined in `RegisterPage.jsx`.

---

## 4. Coding & Design Standards
- **Design Aesthetic**: Rich Navratri theme with modern glassmorphism, tailored gradients, smooth GSAP micro-animations, and responsive layouts.
- **Tailwind CSS v4**: Utilize clean utility classes and semantic CSS variables.
- **Mobile First**: All pages and interactive forms must be fully responsive across mobile, tablet, and desktop viewports.
- **Accessibility**: Ensure form fields have appropriate labels, aria attributes, and keyboard navigability.

---

## 5. Master Folder Synchronization & Future Roadmap
- **Git Push Policy**:
  - **DO NOT push to master-folder or any remote without explicit user command.** Keep local work isolated and safe.
- **Git Remote Management**:
  - Origin remote points to `https://github.com/Maanpatel8436/GSFCU_GOT_TALENT.git`.
  - When integrated as a submodule or part of a multi-repo master workspace, maintain clean atomic commits following Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`).
- **Backend / Database Integration**:
  - Connect registration submissions to a live backend (PostgreSQL / Firebase / Google Sheets API) when ready.
- **Admin Dashboard**:
  - Future expansion for participant check-in, audition scoring, and judge panel evaluations.

