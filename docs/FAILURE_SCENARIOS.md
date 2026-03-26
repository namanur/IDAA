# IDAA: Pipeline Failure Scenarios & Mitigation

## 1. Gemini API Timeout / 5xx
- **Scenario**: Gemini fails to return content after 30+ seconds.
- **Impact**: Status stays at `generating`, user sees "Delayed" badge.
- **Mitigation**: 
  - Admin UI detects `status=generating` for > 10 mins.
  - Show "Retry Generation" button with exponential backoff logic.
  - Increment `generation_attempts`.

## 2. Token Limit Exhausted (Free Tier)
- **Scenario**: Monthly research quota hit mid-generation.
- **Impact**: Status set to `failed`. 
- **Mitigation**:
  - `last_error` stores "RESOURCE_EXHAUSTED".
  - UI triggers "Token Fallback" banner (UPI/Email).
  - Admin manually marks as `delayed` with a "Expected on [date]" note.

## 3. Review Delay
- **Scenario**: Content generated but admin (Naman) doesn't have 30 mins to review.
- **Impact**: Status stays at `generated` or `reviewing`. Release date passes.
- **Mitigation**:
  - Student UI checks `release_date` vs `status`.
  - If `status != published` and `release_date <= today`, show "Refining Content" status.
  - Student can bookmark to get notified when "Live".

## 4. Prompt Versioning Conflict
- **Scenario**: You update the prompt but it breaks the structured markdown for old topics.
- **Impact**: Reader module can't parse TOC or Highlights.
- **Mitigation**:
  - Use `topic_versions`. 
  - Each version linked to a `prompt_id` (meta-data).
  - Old books stay on old parsers until manually re-generated.

## 5. Duplicate Release Date (Constraint Error)
- **Scenario**: Accidental manual entry of two topics for Day 12.
- **Impact**: Database rejects the write.
- **Mitigation**:
  - `UNIQUE(release_date)` is the hard constraint.
  - Admin UI prevents picking a date that is already taken.
  - Gap check: Alert admin if tomorrow's `release_date` is empty.
