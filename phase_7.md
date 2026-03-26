# CA Interview Prep (idaa) - Navigation & Module Consolidation

## Phase 7: Navigation & Module Consolidation
- **Goal**: Simplify the UI by removing the sidebar, consolidating modules, and fixing navigation inconsistencies.
- **Tasks**:
  - [ ] **Remove Sidebar**: Delete `src/components/layout/Sidebar.tsx` and update `src/app/layout.tsx` to remove the sidebar and its associated padding.
  - [ ] **Enhance Navbar**: Ensure the top Navbar contains links for Dashboard, Syllabus, Modules, Bookmarks, and Console (Admin).
  - [ ] **Unify Dashboard Modules**: Remove the "Explore All" button. Update the Module grid to show all 6 categories: Excel, GST, TDS, Accounting, Tally, Interview.
  - [ ] **Fix Category Inconsistency**: Audit all files (`page.tsx`, `syllabus/page.tsx`, `category/[slug]/page.tsx`) to ensure they use the standard 6 categories with consistent casing.
  - [ ] **Admin Access Verification**: Ensure the `/admin` path is clearly linked as "Console" or "Admin" in the Navbar.
  - [ ] **Performance Review**: Check font and icon loading (Material Symbols) to address the "slow load" issue.
- **Validation**: 
  - Sidebar is gone; layout is full-width.
  - Navbar contains all 5 primary links.
  - Dashboard shows 6 modules in a clean grid.
  - No "Financial Reporting" or old categories remain in the UI.
  - `npm run build` succeeds.
