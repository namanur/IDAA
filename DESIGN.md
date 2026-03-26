# DESIGN SYSTEM - CA Interview Prep (idaa)

## 🎨 Color Palette
The palette is designed to look professional, trustworthy, and academic.

- **Primary**: `#1A237E` (Deep Indigo) — Trust, authority, CA branding.
- **Secondary**: `#FFC107` (Amber) — Attention, progress, highlights.
- **Success**: `#2E7D32` (Green) — Completed tasks, correct answers.
- **Background**: `#F5F5F5` (Light Gray) — Clean, paper-like reading experience.
- **Surface**: `#FFFFFF` (White) — Content cards, sidebars.
- **Text**: `#212121` (Off-black) — Maximum readability.

## 🔠 Typography
- **Headings**: `Inter` or `Plus Jakarta Sans` (Bold) — Modern and professional.
- **Body**: `Inter` (Regular) — Highly readable for long-form content.
- **Code/Formulae**: `JetBrains Mono` or `Fira Code` — For Excel formulas and journal entries.

## 📏 Layout & Spacing
- **Base Unit**: `4px`
- **Container**: `1200px` max-width.
- **Mobile First**: All components must be optimized for iPad (primary) and iPhone.
- **Reading View**: Max line length of `70ch` for optimal reading speed.

## ✨ Interactive Elements
- **Topic Cards**: Subtle elevation change on hover.
- **"Show Solution"**: Accordion-style reveal with a smooth transition.
- **Highlighting**: CSS background-color change (Amber) with persistence.

## 📱 PWA Elements
- **Theme Color**: `#1A237E`
- **Icon**: Minimalist "idaa" logo (Deep Indigo background).
- **Offline Message**: Simple "You are offline. Cached books are still available."

## 🛡️ Invariant Rules (The Ground Truth)
- **Review Required**: No topic can be `published` without at least one manual review cycle.
- **One-per-Day**: Exactly one `published` topic is allowed per `release_date`.
- **Immutable History**: Once a `topic_version` is created, it cannot be modified; only a new version can be created.
- **Controlled Throughput**: Maximum of 1 active generation task across the entire system.
- **No Regression**: A topic in `published` status cannot revert to `generating`.

## 🔄 Deterministic State Machine
| Transition | Trigger | Condition |
| :--- | :--- | :--- |
| `queued` → `generating` | Cron / Admin | `status = 'queued'` AND `active_tasks < 1` |
| `generating` → `generated` | Content engine success | Version 1 created in `topic_versions` |
| `generating` → `failed` | Processing Error (3x) | `generation_attempts >= 3` |
| `generated` → `reviewing` | Admin Opens | Admin enters "Review UI" |
| `reviewing` → `ready` | Admin Approve | `current_version_id` assigned; review notes saved |
| `ready` → `published` | Time Logic | `release_date <= now()` AND `status = 'ready'` |
| Any → `delayed` | System/Admin | `release_date` passed but `status != ready` |

## 💰 Monetization / Fallback UI
- **Banner**: Amber background (`#FAEEDA`), Brown text (`#633806`).
- **CTA**: Clear "Email to Unlock" button + UPI QR code placeholder.
- **Transparency**: Honest messaging about processing limits.
