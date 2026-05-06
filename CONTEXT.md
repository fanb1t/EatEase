# EatEase Project Context

## Project Goal

Build EatEase, a realtime restaurant ordering web app where customers scan a table-specific QR link, browse menus, submit orders, and the kitchen receives orders with table information in realtime.

## Core Requirements

- Customer ordering through table-specific QR links.
- Kitchen dashboard receives realtime orders and shows the table number.
- Admin can manage menu categories and menu items.
- Initial default categories:
  - เครื่องดื่ม
  - อาหารจานหลัก
  - ของทานเล่น
  - โรตี
  - ขนมปัง
  - ยำ
- Admin can add custom categories and menu items.
- Menu items support Thai and English names.
- Menu images are uploaded through admin and should load quickly.
- UI supports Thai and English.
- System should be designed for approximately 200-300 concurrent users.
- No online payment in v1.

## Architecture Direction

- Frontend: React + TypeScript + Vite.
- Backend: Supabase for database, auth, realtime, and storage.
- Use service layers so UI does not directly depend on Supabase SDK everywhere.
- Use client-side caching, lazy image loading, thumbnails, and skeleton loading for fast menu browsing.

## Agent Roles

### 1. Frontend Agent

Responsible for:

- Customer menu page.
- Cart and order submission UI.
- Table QR route flow.
- Kitchen dashboard UI.
- Admin menu/category/table management UI.
- Thai/English language switching.
- Responsive layout for mobile and desktop.
- Frontend performance and image loading UX.

### 2. Backend Agent

Responsible for:

- Supabase schema design.
- Tables: `tables`, `menu_categories`, `menu_items`, `orders`, `order_items`.
- Row Level Security policies.
- Realtime subscriptions.
- Storage bucket and upload flow for menu images.
- Backend-facing service functions and types.

### 3. Coordinator Agent

Responsible for:

- Breaking work into tasks.
- Keeping frontend and backend contracts aligned.
- Updating this `CONTEXT.md` whenever tasks or status change.
- Tracking progress, blockers, and completed work.
- Checking implementation against project requirements.
- Maintaining the final acceptance checklist.

## Current Work Session

- Coordinator is active in the main workspace.
- Frontend Agent completed UI, routes, bilingual copy, customer/kitchen/admin flows, and image upload UX.
- Backend Agent completed Supabase schema, service layer, realtime helpers, mock fallback, and seed/test coverage.
- Coordinator integrated dependencies/config, fixed Vite plugin config, installed packages, and verified build/test/lint.

## Task Board

### Coordinator

| Task | Status | Notes |
| --- | --- | --- |
| Create project context file | Done | `CONTEXT.md` created as the central coordination file. |
| Define frontend/backend responsibilities | Done | Agent roles documented. |
| Scaffold shared project config | Done | Added package, Vite, TypeScript, ESLint, Vitest, env example, gitignore. |
| Track implementation progress | Done | This file reflects the first implementation pass. |
| Integrate frontend/backend work | Done | Frontend and backend service contracts are aligned through `eatEaseApi`. |
| Verify requirements coverage | Done | `npm run build`, `npm test`, and `npm run lint` pass. |

### Frontend

| Task | Status | Notes |
| --- | --- | --- |
| Scaffold React + TypeScript + Vite app | Done | App entrypoint, config, and global styling are in place. |
| Add routing for customer, kitchen, admin | Done | Routes: `/table/:tableSlug`, `/kitchen`, `/admin`; home falls back to demo table. |
| Build customer menu and cart flow | Done | Supports categories, cart, order submission, status display, and fast image UX. |
| Build kitchen realtime dashboard | Done | Shows table number, active queue, served orders, and status actions. |
| Build admin category/menu/table UI | Done | Supports custom categories, menu items, tables, and menu image upload. |
| Add i18n support | Done | Thai and English text supported. |
| Add loading, empty, and error states | Done | Initial loading and empty states are included. |

### Backend

| Task | Status | Notes |
| --- | --- | --- |
| Configure Supabase client | Done | Uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`; local mock fallback works without env vars. |
| Create database schema | Done | Migration includes table, menu, order entities. |
| Add RLS policies | Done | Public read/order creation plus authenticated admin/kitchen writes. |
| Add realtime order subscriptions | Done | Service helpers support kitchen and customer order updates. |
| Add storage bucket for menu images | Done | `menu-images` bucket and upload helper are included. |
| Add seed data | Done | Default categories plus demo tables/menu items are included. |
| Implement service layer | Done | UI is routed through `eatEaseApi` and backend services. |

### Testing

| Task | Status | Notes |
| --- | --- | --- |
| Unit tests for cart/order logic | Partial | Backend contract seed tests pass; broader UI/cart tests remain for next pass. |
| Integration tests for table order flow | Partial | Mock fallback flow is implemented; automated browser integration remains for next pass. |
| Realtime status update test | Partial | Realtime helpers are implemented; Supabase environment test remains for deployment. |
| Admin CRUD test | Partial | UI/service flows are implemented; automated CRUD tests remain for next pass. |
| Performance sanity test | Partial | Lazy images, thumbnails, caching, and build verification are in place; load simulation remains for deployment. |

## Change Log

| Date | Change |
| --- | --- |
| 2026-05-06 | Created `CONTEXT.md` and renamed the planned coordination file from `agend.md` to `CONTEXT.md`. |
| 2026-05-06 | Started implementation session with Coordinator, Frontend Agent, and Backend Agent roles. |
| 2026-05-06 | Added shared Vite, TypeScript, ESLint, Vitest, env, and gitignore project files. |
| 2026-05-06 | Completed first implementation pass for frontend, backend service layer, Supabase migration/seed, local mock fallback, and admin image upload. |
| 2026-05-06 | Installed dependencies and verified `npm run build`, `npm test`, and `npm run lint` pass. |
