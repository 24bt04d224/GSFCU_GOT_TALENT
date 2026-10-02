# Project Architecture & Synchronization Guide

This guide documents the integration between **GSFCU Got Talent** and master workspace management workflows.

> [!IMPORTANT]
> **Git Push Policy**: Do NOT automatically push changes to master-folder or external git remotes without explicit manual confirmation.

---


## 1. Synchronization Strategies with Master Folder

### Option A: Git Submodule Integration (Recommended for Multi-Repo setups)
If your `master-folder` is a parent Git repository coordinating multiple projects, you can attach this repository as a submodule:
```bash
# Inside master-folder:
git submodule add https://github.com/24bt04d224/GSFCU_GOT_TALENT.git projects/gsfcu-got-talent
git commit -m "feat: link GSFCU Got Talent as submodule"
```

To update or synchronize:
```bash
git submodule update --remote --merge
```

### Option B: Monorepo / Workspaces Integration
If `master-folder` uses npm/pnpm/yarn workspaces:
```json
{
  "name": "master-workspace",
  "workspaces": [
    "apps/*",
    "packages/*",
    "projects/gsfcu-got-talent"
  ]
}
```

### Option C: Secondary Git Remote (Direct Sync)
To push changes to a master repository or backup remote directly from this repo:
```bash
git remote add master-remote <MASTER_REPO_URL>
git push master-remote main
```

---

## 2. Environment & Configuration
- **Node.js**: >= 18.x
- **Development Server**: `npm run dev`
- **Production Build**: `npm run build`
- **Linting**: `npm run lint`

---

## 3. Data Architecture (`src/data/eventData.js`)
| Exported Object | Description |
| :--- | :--- |
| `EVENT_DETAILS` | Core dates, university name, venue, email, social handles, WhatsApp link |
| `TALENT_CATEGORIES` | Array of 6 categories (Singing, Dance, Drama, Instrumental, Comedy, Other) |
| `HOW_IT_WORKS_STEPS` | 3-step pipeline (Register -> Auditions -> Grand Showcase) |
| `IMPORTANT_INFO` | Essential guidelines, eligibility, and equipment details |
| `RULES_AND_GUIDELINES` | 6 strict rules for participants (ID card, time limits, decorum, etc.) |
| `FAQS` | Frequently asked questions and answers |

---

## 4. Future Expansion Roadmap
- [ ] **Audition Check-in Portal**: QR-code scanning or Enrollment search for verifying registered students at the auditorium gate on 22 October 2026.
- [ ] **Live Judge Scoring System**: Digital evaluation sheet for judges to score technical, stage presence, and creativity metrics.
- [ ] **Automated WhatsApp / Email Alerts**: Auto-dispatch confirmation receipts with registration ID (`GT26-XXXX`).
- [ ] **Leaderboard & Showcase Gallery**: Display finalist photos, video reels, and announcements.
