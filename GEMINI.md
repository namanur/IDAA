# GEMINI.md - CA Interview Prep (idaa-web)

This file provides foundational context, architectural patterns, and development standards for the `idaa-web` project.

## 🚀 Project Overview
`idaa-web` is a specialized platform designed for Chartered Accountant (CA) interview preparation. It features an AI-powered content pipeline (using Gemini) to generate daily topics, a robust versioning system for content review, and a professional, academic-focused user experience.

- **Goal**: Deliver high-quality, daily interview preparation content for CA aspirants.
- **Core Engine**: A state-machine-driven pipeline that manages content from "queued" to "published".
- **Design Philosophy**: Trustworthy, professional, and academic (Deep Indigo & Amber palette).

## 🛠️ Tech Stack
- **Framework**: Next.js 16.2.1 (App Router)
- **Library**: React 19.2.4
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 4+ (with `@tailwindcss/postcss`)
- **Backend/Auth**: Supabase (`@supabase/supabase-js`)
- **Icons**: Lucide React
- **Package Manager**: Bun (preferred)
- **PWA**: `next-pwa`

## 🏗️ Architecture & Data Model
The project uses a structured database schema (Supabase/PostgreSQL) defined in `supabase/schema.sql`.

### Key Tables:
- `topics`: Tracks the state, release date, and observability metrics (token usage, attempts).
- `topic_versions`: Stores historical markdown versions of topic content to prevent data loss.
- `user_profiles`: Manages roles (`admin`, `student`) and engagement metrics (streaks).
- `user_progress`: Tracks topic completion and last accessed timestamps.

### Content Pipeline States:
`queued` ➡️ `generating` ➡️ `generated` ➡️ `reviewing` ➡️ `ready` ➡️ `published` (or `failed`/`delayed`).

## 📜 Development Conventions

### 1. Planning & Tracking
- **`phase.md`**: The primary roadmap. Always check this to see current tasks and goals.
- **`AUDIT.md`**: A chronological log of all major changes and completions. Update this after finishing a task.
- **`DESIGN.md`**: The source of truth for UI/UX. Adhere strictly to the color palette, typography, and spacing units (4px base).

### 2. Implementation Rules
- **Next.js v16+**: Be aware of potential API differences from older versions. Refer to `AGENTS.md` and local `node_modules` docs if unsure.
- **Mobile-First**: Design components for iPad/iPhone first.
- **Resilience**: Implement retry logic and clear error states for AI generation.
- **Versioning**: Never overwrite `topic_versions`; always increment the version number.

### 3. Key Commands
- `bun dev`: Start development server.
- `bun build`: Production build.
- `bun lint`: Run ESLint.
- `bun test`: (TODO: Setup testing framework).

## 📂 Directory Structure
- `src/app/`: Next.js App Router pages and layouts.
- `src/lib/`: Shared utilities and clients (e.g., `supabase.ts`).
- `supabase/`: Database migrations and schema definitions.
- `docs/`: Supplemental documentation (e.g., `FAILURE_SCENARIOS.md`).
- `public/`: Static assets and PWA icons.

## 🛠️ Current Focus (Phase 1)
- Implementing Auth UI (Login/Signup).
- Building the Home Screen with Topic Cards.
- Setting up the Admin Dashboard for content review.
