<<<<<<< HEAD
# 🎭 GSFCU Got Talent 2026 — Navratri Special Edition
=======
# 🎭 GSFCU Got Talent 2026
>>>>>>> 5d886f7 (Updated Changes)

The official web platform and audition management portal for **GSFC University Got Talent 2026**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F24bt04d224%2FGSFCU_GOT_TALENT)

---

## 🌟 Key Features

- **Cinematic Event Design**: Navratri-inspired color palette (**Rust Orange**, **Terracotta**, **Ochre**, **Warm White**, **Olive Green**) with rich stage aesthetic.
- **Multi-Step Talent Registration**: Comprehensive form with live field validations, participant count, and performance category selection.
- **Audio & Media Track Upload**: Direct backing track upload for singers, dancers, and performers with in-form audio test player and Google Drive support.
- **Scannable VIP Digital Entry Pass**: Dynamic QR code ticket generated for verified gate check-in at the university auditorium.
- **Organizing Committee Dashboard (`/admin`)**: Passcode-protected console (`gsfcu2026`) featuring real-time KPI metrics, express scanner check-in, in-dashboard sound console audio player, candidate search/filter, and instant CSV call sheet export.
- **Direct Candidate Notifications**: Automated 1-click WhatsApp and Email confirmation dispatchers.
- **Cloud Database Ready**: Live Supabase PostgreSQL and storage bucket integration with offline local storage fallback.

---

## 🚀 Deployments & Repositories

- **1-Click Vercel Deploy**: [Deploy to Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F24bt04d224%2FGSFCU_GOT_TALENT)
- **Master Repository**: [https://github.com/24bt04d224/GSFCU_GOT_TALENT](https://github.com/24bt04d224/GSFCU_GOT_TALENT)

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run Oxlint
npm run lint
```

---

## 🗄️ Database Setup (Supabase)

1. Create a free project at [supabase.com](https://supabase.com/).
2. Run the SQL statements from [`supabase_schema.sql`](./supabase_schema.sql) in your Supabase SQL editor.
3. Copy `.env.example` to `.env` and fill in your Supabase Project URL and Anon Key.
