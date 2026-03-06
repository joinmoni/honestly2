# Honestly MVP Implementation Spec

This file is the source of truth for Phase 1 implementation.

## Scope
- Build the Honestly MVP in Next.js App Router with TypeScript, Tailwind CSS, and Framer Motion.
- Use hardcoded data only through typed mock data and service layers.
- Keep UI components data-agnostic so data sources can be swapped to Supabase later with minimal refactor.

## Architecture Rules
- No hardcoded dataset literals inside page/component files.
- Domain models live in `/lib/types`.
- Mock datasets live in `/lib/mock-data`.
- Async-like data access functions live in `/lib/services`.
- Prefer server components for static page shells; use client components for interactive elements.
- Use local component state only where interaction requires it.
- Add automated tests as features are built to reduce UI and service-layer regressions.

## Data Layer Contract
- Services expose async signatures (e.g. `getVendors()`, `getVendorBySlug(slug)`) even when in-memory.
- Mock auth session uses a `MockSession` with `user` and `role` fields.
- Mock implementations sit behind a swappable data-layer contract so future providers can replace them without changing page/component imports.
- Future migration path:
  1. Keep same service function signatures.
  2. Swap mock implementations for Supabase-backed implementations.
  3. Keep UI unchanged.

## Search Architecture
- Phase 1 search should stay service-contract-first, not API-route-first.
- Homepage search should provide lightweight grouped suggestions for vendors, categories, and locations.
- Vendors page search should use the same service layer for query/filter-driven result updates.
- Search guardrails:
  1. Debounce input by 200–300ms.
  2. Require at least 2–3 characters before querying.
  3. Limit suggestions to 5–8 results per group.
  4. Ignore stale responses when newer input is in flight.
- Target suggestion contract:

```ts
type SearchSuggestions = {
  vendors: { id: string; name: string; slug: string }[];
  categories: { id: string; name: string; slug: string }[];
  locations: { city: string; region?: string }[];
};
```

## Route Plan
- Public: `/`, `/vendors`, `/vendor/[slug]`, `/category/[slug]`, `/category/[slug]/[subcategorySlug]`, `/lists/[shareSlug]`
- User/Auth: `/login`, `/saved`, `/lists`, `/lists/[id]`, `/me/reviews`
- Vendor: `/claim/[vendorSlug]`, `/vendor-dashboard/[vendorSlug]/edit`
- Admin: `/admin`, `/admin/reviews`, `/admin/claims`, `/admin/categories`, `/admin/vendors`, `/admin/rating-criteria`

## Admin Merchandising
- Taxonomy management should support homepage merchandising controls for categories and subcategories.
- Admins should be able to mark a category or curated subcategory row as `featured on home`.
- Admins should be able to manage homepage row order so promoted taxonomy rows appear in a deliberate sequence.
- This should live with taxonomy/category management rather than as a separate CMS surface.

## Current Milestone
- HON-001 Foundation
- HON-002 Domain types + mock data + services
- HON-003 Design system primitives
- HON-010 Homepage
- HON-011 Vendor listing card/grid
- HON-012 Vendors listing page
- HON-013 Category listing page
- HON-014 Homepage search suggestions dropdown
- HON-015 Debounced mock-backed search service contract
- HON-016 Vendors page live service-backed search
- HON-070 Interface-based service data layer
- HON-020 Vendor detail page shell
- HON-022 Quick review modal flow
- HON-030 Save and favorite interaction
- HON-040 Login screen
- HON-031 Save-to-list modal interaction
- HON-033 Public shared collection page
- HON-041 My reviews page
- HON-050 Claim vendor page
- HON-060 Admin shell
- HON-061 Admin reviews moderation page
- HON-062 Admin claims moderation page
- HON-063 Admin taxonomy management page
- HON-064 Admin vendor directory page
- HON-065 Admin rating criteria page
- HON-066 Homepage category merchandising controls
- HON-051 Vendor edit page

## UI Direction
- Clean, airy, premium visual language.
- Subtle motion only.
- Mobile-first responsive behavior.

## Footer Policy
- Public pages use the full trust/SEO footer.
- Auth, admin, and edit/task-focused pages use no footer (or sticky minimal footer if needed later).
- Shared collection pages use the light footer variant to preserve the editorial moodboard feel.

## Next Search Tickets
- HON-014 Homepage search suggestions dropdown
- HON-015 Debounced mock-backed search service contract
- HON-016 Vendors page live service-backed search
- HON-112 Supabase-backed search implementation
- HON-113 Meilisearch upgrade path
