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
- Frontend Agent is implementing UI, routes, bilingual copy, and customer/kitchen/admin flows.
- Backend Agent is implementing Supabase schema, service layer, realtime helpers, mock fallback, and tests.

## Task Board

### Coordinator

| Task | Status | Notes |
| --- | --- | --- |
| Create project context file | Done | `CONTEXT.md` created as the central coordination file. |
| Define frontend/backend responsibilities | Done | Agent roles documented. |
| Scaffold shared project config | Done | Added package, Vite, TypeScript, ESLint, Vitest, env example, gitignore. |
| Track implementation progress | In Progress | Updating this file as work changes. |
| Integrate frontend/backend work | In Progress | Waiting for agent output, then coordinator will merge and verify. |
| Verify requirements coverage | Not Started | Run after frontend/backend implementation. |

### Frontend

| Task | Status | Notes |
| --- | --- | --- |
| Scaffold React + TypeScript + Vite app | In Progress | Shared config is ready; UI files are being prepared. |
| Add routing for customer, kitchen, admin | In Progress | Routes planned: `/table/:tableSlug`, `/kitchen`, `/admin`. |
| Build customer menu and cart flow | In Progress | Must support fast image loading and bilingual UI. |
| Build kitchen realtime dashboard | In Progress | Must show table number and order status. |
| Build admin category/menu/table UI | In Progress | Must allow custom categories and menu items. |
| Add i18n support | In Progress | Thai and English required. |
| Add loading, empty, and error states | In Progress | Needed for production-quality UX. |

### Backend

| Task | Status | Notes |
| --- | --- | --- |
| Configure Supabase client | In Progress | Requires env variables; local demo fallback planned. |
| Create database schema | In Progress | Includes table, menu, order entities. |
| Add RLS policies | In Progress | Customer, kitchen, admin permissions. |
| Add realtime order subscriptions | In Progress | Customer subscribes to own table/session; kitchen subscribes to restaurant orders. |
| Add storage bucket for menu images | In Progress | Include thumbnail strategy. |
| Add seed data | In Progress | Default categories plus demo data. |
| Implement service layer | In Progress | Separate UI from Supabase SDK. |

### Testing

| Task | Status | Notes |
| --- | --- | --- |
| Unit tests for cart/order logic | Not Started | Totals, quantity changes, language fallback. |
| Integration tests for table order flow | Not Started | Ensure table data does not mix. |
| Realtime status update test | Not Started | Kitchen update should reach customer. |
| Admin CRUD test | Not Started | Categories, menu items, availability. |
| Performance sanity test | Not Started | Check menu/image loading and 200-300 user target. |

## Change Log

| Date | Change |
| --- | --- |
| 2026-05-06 | Created `CONTEXT.md` and renamed the planned coordination file from `agend.md` to `CONTEXT.md`. |
| 2026-05-06 | Started implementation session with Coordinator, Frontend Agent, and Backend Agent roles. |
| 2026-05-06 | Added shared Vite, TypeScript, ESLint, Vitest, env, and gitignore project files. |

