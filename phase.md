# CA Interview Prep (idaa) - Refactored Roadmap (v4 - Production Safe)

## Phase -1: Data Architecture & Robustness
- **Goal**: Define the core engine, state machine, and data integrity rules.
- **Tasks**:
  - [x] **Finalize Schema**: `topics`, `topic_versions`, `user_progress`.
  - [x] **State Machine**: Define strict lifecycle in `DESIGN.md`.
  - [x] **Invariant Rules**: Codified in `DESIGN.md`.
  - [x] **Failure Scenarios**: Documented deterministic actions.
  - [ ] **Idempotency Strategy**: Implementation of `idempotency_key` and atomic locks.
- **Validation**: Schema applied; Lifecycle answers the 5 critical questions.

## Phase 0: Design System & Constraints
- **Goal**: UI tokens and hard constraints (1 topic/day enforcement).
- **Tasks**:
  - [x] Initial `DESIGN.md`.
  - [x] Add Pipeline status UI tokens (Delayed, Failed, Reviewing).
  - [x] Define Scheduler constraints (release_date unique index).
  - [ ] **Stitch Designs**: Complete (Home, Reader, Admin).

## Phase 1: Core Infrastructure
- **Goal**: Next.js + Supabase + Auth (Roles).
- **Tasks**:
  - [x] Initialize Next.js project.
  - [ ] Implement Auth with **Admin vs Student** roles.
  - [ ] Setup DB Migrations.

## Phase 2: Pipeline Engine & Admin Control
- **Goal**: The "Heart" of the system.
- **Tasks**:
  - [ ] **Admin Dashboard**: List topics, trigger Gemini, review markdown.
  - [ ] **Generation Engine**: Implement retry logic and version promotion.
  - [ ] **Locking Mechanism**: Atomic updates for race condition prevention.
  - [ ] **Scheduler**: Daily Cron for automatic state progression.

## Phase 3: Reader & UX Reality
- **Goal**: Resilient student experience.
- **Tasks**:
  - [ ] Markdown reader with version support.
  - [ ] **Status-aware UI**: "Delayed", "Coming Soon", "Token Fallback".
  - [ ] Custom Excel problem renderer (replacing Sheets iframe).

## Phase 4: Engagement & Polish
- **Goal**: Dashboards, streaks, and search.

## Phase 5: Production Hardening
- **Goal**: Monitoring, logs, and failure alerts.
