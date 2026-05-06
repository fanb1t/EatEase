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
- Seed data for default categories and demo tables/menu items.
- Backend-facing service functions and types.

### 3. Coordinator Agent

Responsible for:

- Breaking work into tasks.
- Keeping frontend and backend contracts aligned.
- Updating this `CONTEXT.md` whenever tasks or status change.
- Tracking progress, blockers, and completed work.
- Checking implementation against project requirements.
- Maintaining the final acceptance checklist.

## Task Board

### Coordinator

| Task | Status | Notes |
| --- | --- | --- |
| Create project context file | Done | `CONTEXT.md` created as the central coordination file. |
| Define frontend/backend responsibilities | Done | Agent roles documented. |
| Track implementation progress | Not Started | Update as work begins. |
| Verify requirements coverage | Not Started | Run after frontend/backend implementation. |

### Frontend

| Task | Status | Notes |
| --- | --- | --- |
| Scaffold React + TypeScript + Vite app | Not Started | Empty workspace detected before implementation. |
| Add routing for customer, kitchen, admin | Not Started | Routes planned: `/table/:tableSlug`, `/kitchen`, `/admin`. |
| Build customer menu and cart flow | Not Started | Must support fast image loading and bilingual UI. |
| Build kitchen realtime dashboard | Not Started | Must show table number and order status. |
| Build admin category/menu/table UI | Not Started | Must allow custom categories and menu items. |
| Add i18n support | Not Started | Thai and English required. |
| Add loading, empty, and error states | Not Started | Needed for production-quality UX. |

### Backend

| Task | Status | Notes |
| --- | --- | --- |
| Configure Supabase client | Not Started | Requires env variables. |
| Create database schema | Not Started | Includes table, menu, order entities. |
| Add RLS policies | Not Started | Customer, kitchen, admin permissions. |
| Add realtime order subscriptions | Not Started | Customer subscribes to own table/session; kitchen subscribes to restaurant orders. |
| Add storage bucket for menu images | Not Started | Include thumbnail strategy. |
| Add seed data | Not Started | Default categories plus demo data. |
| Implement service layer | Not Started | Separate UI from Supabase SDK. |

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

