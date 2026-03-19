# Honestly MVP Ticket Backlog

## Epic 0 — Foundation
- [x] HON-001 Setup Next.js app foundation
- [x] HON-002 Create domain types and mock data structure
- [x] HON-003 Build design system primitives

## Epic 1 — Public browsing
- [x] HON-010 Build homepage
- [x] HON-011 Build vendor card and vendor grid
- [x] HON-012 Build vendors listing page
- [x] HON-013 Build category page
- [x] HON-014 Build homepage search suggestions dropdown
- [x] HON-015 Build debounced mock-backed search service contract
- [x] HON-016 Wire vendors page filters to live service-backed search

## Epic 2 — Vendor profile and reviews
- [x] HON-020 Build vendor detail page shell
- [ ] HON-021 Build review list and review cards (needs screen)
- [x] HON-022 Build quick review form/modal

## Epic 3 — Saved vendors and lists
- [x] HON-030 Build save/favorite interaction
- [x] HON-031 Build save-to-list modal
- [x] HON-032 Build user lists pages
- [x] HON-033 Build public shared list page

## Epic 4 — Auth and profile-lite
- [x] HON-040 Build login screen
- [x] HON-041 Build my reviews page
- [ ] HON-114 Add user avatars from auth providers and manual profile photo upload
- [ ] HON-115 Add create-list flow from /lists
- [ ] HON-116 Wire New Moodboard card to create and open a new collection

## Epic 5 — Claim flow and vendor editing
- [x] HON-050 Build claim vendor page
- [x] HON-051 Build vendor edit page

## Epic 6 — Admin MVP
- [x] HON-060 Build admin shell
- [x] HON-061 Build admin reviews moderation page
- [x] HON-062 Build admin claims page
- [x] HON-063 Build admin categories page
- [x] HON-064 Build admin vendors page
- [x] HON-065 Build rating criteria management page
- [x] HON-066 Build homepage category merchandising controls

## Epic 7 — Integration prep
- [x] HON-070 Refactor mock services to interface-based data layer
- [x] HON-071 Add loading, empty, error, skeleton states
- [x] HON-072 Add responsive polish and motion pass

## Phase 2 — Real data and search evolution
- [ ] HON-100 Setup Supabase project wiring
- [ ] HON-101 Implement Supabase auth
- [ ] HON-102 Create database schema
- [ ] HON-103 Seed categories/vendors/reviews
- [ ] HON-104 Replace mock vendor service with Supabase queries
- [ ] HON-105 Replace mock review service with Supabase queries
- [ ] HON-106 Replace mock lists service with Supabase queries
- [ ] HON-107 Connect vendor image uploads to Supabase storage
- [ ] HON-108 Add admin mutations
- [ ] HON-109 Add claim submission persistence
- [ ] HON-110 Add basic DB-backed search
- [ ] HON-111 Add route protection and role enforcement
- [ ] HON-112 Replace mock search service with Supabase-backed search
- [ ] HON-113 Upgrade search backend to Meilisearch
