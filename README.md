# Hevn — Production Next.js Architecture

Welcome to the **Hevn Landing & Waitlist** codebase, restructured according to production standards with modular frontend components, dedicated backend services, and clean root directory organization.

---

## 🏗 Directory Structure Overview

```text
hevn_landingnow/
├── frontend/                     # Next.js App Router Application
│   ├── public/
│   │   └── images/               # Production image assets (logo, hero visuals)
│   ├── src/
│   │   ├── app/                  # App Router pages & API routes
│   │   │   ├── api/waitlist/     # Waitlist POST API endpoint
│   │   │   ├── layout.tsx        # Global fonts, metadata & SEO setup
│   │   │   └── page.tsx          # Landing page layout composition
│   │   ├── components/           # React Components
│   │   │   ├── layout/           # Header, Footer
│   │   │   ├── sections/         # HeroSection, RoadmapSection, WaitlistSection, FinalCTASection
│   │   │   └── modals/           # ShareModal & shortlisting popups
│   │   └── styles/
│   │       └── globals.css       # Global design system & theme variables
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.js
│
├── backend/                      # Services, Database & Maintenance Scripts
│   ├── db/
│   │   └── migrations/           # 001_create_waitlist.sql (Supabase Postgres migration)
│   ├── services/
│   │   └── waitlist.service.ts   # Core business logic for SendGrid & Supabase integration
│   ├── certs/
│   │   └── prod-ca-2021.crt      # Secure SSL Certificate storage
│   └── scripts/
│       └── test-waitlist.ts      # API test runner script
│
├── .env.example                  # Environment configuration template
├── package.json                  # Workspace script runner
└── README.md                     # Project documentation
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Install frontend dependencies
cd frontend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `frontend/.env.local` (or root `.env`):
```bash
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM=no-reply@yourdomain.com
WAITLIST_TO=team@yourdomain.com
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Run Development Server
From the root directory:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠 Features & Verification

- **Next.js App Router**: Componentized UI structure built with TypeScript and serverless API handlers.
- **Waitlist API (`POST /api/waitlist`)**: Validates input, persists signup data in Supabase, and dispatches team notifications & user confirmation emails via SendGrid.
- **Demo Mode**: Includes a front-end toggle (`Demo mode (no emails)`) allowing non-technical testers to test the full submission UX without sending real emails.
