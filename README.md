# MediCore HMS — Hospital Management System

> A production-ready, full-stack hospital management system for managing patients, doctors, appointments, and clinical operations — built with **Next.js 15**, **PostgreSQL**, and **Tailwind CSS**.

---

## Overview

MediCore HMS is a comprehensive digital operations platform designed to replace fragmented, paper-based hospital workflows with a unified, real-time web interface. It gives clinical and administrative staff a single system to track patient status, manage doctor availability, schedule appointments, and monitor KPIs — all without switching between tools.

The system is built around four core domains:

- **Patients** — intake, profiling, status tracking, and medical history
- **Doctors** — credential management, department assignment, and availability
- **Appointments** — scheduling, lifecycle management, and inline status updates
- **Dashboard** — live operational visibility across all domains

Whether you're running a small clinic or a multi-department hospital, MediCore HMS is designed to be deployed quickly, extended easily, and used without training overhead.

---

## Screenshots

### Dashboard
![Dashboard Overview](./public/hms-screenshots/dashboard.png)
> Live KPI stats, recent appointments feed, and patient watch list at a glance.

### Patients
| List View | Add Patient | Edit Patient | Delete Confirm |
|-----------|-------------|--------------|----------------|
| ![Patients List](./public/hms-screenshots/patients-list.png) | ![Add Patient](./public/hms-screenshots/patients-add.png) | ![Edit Patient](./public/hms-screenshots/patients-edit.png) | ![Delete Patient](./public/hms-screenshots/patients-delete.png) |

### Doctors
| Grid View | Add Doctor | Edit Doctor |
|-----------|------------|-------------|
| ![Doctors Grid](./public/hms-screenshots/doctors-grid.png) | ![Add Doctor](./public/hms-screenshots/doctors-add.png) | ![Edit Doctor](./public/hms-screenshots/doctors-edit.png) |

### Appointments
| List View | Schedule Appointment | Edit Appointment | Quick Status Update |
|-----------|----------------------|------------------|---------------------|
| ![Appointments List](./public/hms-screenshots/appointments-list.png) | ![Schedule](./public/hms-screenshots/appointments-add.png) | ![Edit](./public/hms-screenshots/appointments-edit.png) | ![Status](./public/hms-screenshots/appointments-status.png) |

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Framework  | Next.js 15 (App Router, `src/` dir) |
| Database   | PostgreSQL via `pg` package         |
| Styling    | Tailwind CSS + custom design        |
| Language   | TypeScript                          |
| Fonts      | Playfair Display + Source Sans 3    |

### Why these choices?

- **Next.js 15 App Router** — co-locates UI components with API routes, enabling full-stack features in a single codebase with no separate backend server required.
- **PostgreSQL + `pg`** — relational integrity is critical for healthcare data; direct `pg` usage keeps the stack lightweight and avoids ORM overhead for complex join queries across patients, doctors, appointments, and departments.
- **Tailwind CSS** — utility-first styling keeps the UI consistent and maintainable without a component library dependency.
- **TypeScript throughout** — shared types between the API layer and UI layer catch schema mismatches at compile time, not at runtime in production.

---

## Features

### Dashboard
- Live KPI cards: active patients, on-duty doctors, today's appointments, critical cases
- Recent appointments feed with patient names, doctor assignments, and statuses
- Patient watch list highlighting critical and high-priority cases
- All stats fetched server-side per request — always reflects current DB state

### Patients
- Full CRUD with form validation
- Search across name, email, and phone simultaneously
- Filter by status: `active`, `stable`, `critical`, `discharged`
- Pagination for large patient lists
- Profiles include blood type, gender, DOB, address, emergency contacts, and freeform medical notes

### Doctors
- Card-grid UI optimised for scanning at a glance
- Full CRUD with department assignment
- License number and specialization tracking
- Status management: `active`, `on_leave`, `inactive`
- Avatar initials auto-generated from names

### Appointments
- Schedule appointments linking a patient, doctor, and department
- Inline quick-status updates without opening a full edit form
- Filter by date, status, and patient/doctor name
- Duration tracking per appointment
- Status lifecycle: `scheduled` → `confirmed` → `in_progress` → `completed` (or `cancelled` / `no_show`)

### Database & API
- Single `migrate.js` command creates all tables and seeds realistic sample data
- Full REST JSON API for all resources — ready for mobile apps or external integrations
- Stateless API routes; authentication layer can be added without restructuring

---

## Architecture

MediCore HMS follows a clean **feature-based folder structure** under `src/app/`, where each domain (patients, doctors, appointments, dashboard) owns its own page, client components, and hooks. Shared UI primitives live in `src/components/ui/` and business logic is centralised in `src/lib/`.

```
src/
├── app/
│   ├── api/                        # REST API route handlers (Next.js Route Handlers)
│   │   ├── appointments/[id]/route.ts
│   │   ├── appointments/route.ts
│   │   ├── dashboard/route.ts
│   │   ├── departments/route.ts
│   │   ├── doctors/[id]/route.ts
│   │   ├── doctors/route.ts
│   │   ├── patients/[id]/route.ts
│   │   └── patients/route.ts
│   ├── appointments/               # Appointments feature: page + all client components
│   │   ├── AppointmentForm.tsx
│   │   ├── AppointmentModal.tsx
│   │   ├── AppointmentsClient.tsx
│   │   ├── AppointmentTable.tsx
│   │   ├── FilterBar.tsx
│   │   └── page.tsx
│   ├── dashboard/                  # Dashboard feature
│   │   ├── DashboardClient.tsx
│   │   ├── DashboardContent.tsx
│   │   ├── DashboardHeader.tsx
│   │   ├── PatientWatch.tsx
│   │   ├── RecentAppointments.tsx
│   │   ├── StatCard.tsx
│   │   └── StatGrid.tsx
│   ├── doctors/                    # Doctors feature
│   │   ├── DoctorCard.tsx
│   │   ├── DoctorFilters.tsx
│   │   ├── DoctorForm.tsx
│   │   ├── DoctorGrid.tsx
│   │   ├── DoctorModal.tsx
│   │   ├── DoctorsClient.tsx
│   │   └── page.tsx
│   ├── patients/                   # Patients feature
│   │   ├── page.tsx
│   │   ├── PatientFilters.tsx
│   │   ├── PatientForm.tsx
│   │   ├── PatientModal.tsx
│   │   ├── PatientPagination.tsx
│   │   ├── PatientsClient.tsx
│   │   ├── PatientTable.tsx
│   │   └── PatientTableRow.tsx
│   ├── error.tsx                   # Global error boundary
│   ├── global-error.tsx
│   ├── globals.css
│   ├── layout.tsx                  # Root layout with sidebar
│   └── page.tsx                    # Root redirect → /dashboard
├── components/
│   ├── layout/
│   │   └── Sidebar.tsx             # Persistent nav sidebar
│   └── ui/                         # Shared atomic UI components
│       ├── Avatar.tsx
│       ├── DeleteConfirmDialog.tsx
│       ├── FormError.tsx
│       ├── index.ts
│       ├── Modal.tsx
│       ├── PageHeader.tsx
│       └── StatusBadge.tsx
├── hooks/                          # Domain-scoped data fetching & filter state hooks
│   ├── appointments/
│   │   ├── useAppointmentFilters.ts
│   │   └── useAppointments.ts
│   ├── dashboard/
│   │   └── useDashboard.ts
│   ├── doctors/
│   │   ├── useDoctorFilters.ts
│   │   └── useDoctors.ts
│   └── patients/
│       ├── usePatients.ts
│       └── usePatientsFilter.ts
└── lib/
    ├── api.ts                      # Typed fetch helpers for all API endpoints
    ├── db.ts                       # PostgreSQL connection pool (singleton)
    ├── format.ts                   # Date, name, and status formatting utilities
    ├── index.ts
    └── types.ts                    # Shared TypeScript types across app and API
```

**Key design decisions:**

- **Co-located API routes** — each `app/api/[resource]/route.ts` handles its own DB queries directly via the `pg` pool, keeping latency low and avoiding unnecessary abstraction layers for a system of this scope.
- **Custom hooks per domain** — `usePatients`, `useAppointments`, etc. encapsulate all fetch logic, optimistic updates, and loading/error state, keeping page components clean.
- **Singleton DB pool** — `lib/db.ts` exports a single `pg.Pool` instance shared across all route handlers, preventing connection exhaustion under concurrent requests.

---

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ (local or cloud)

### 1. Install dependencies
```bash
npm install
```

### 2. Set up PostgreSQL

**Option A — Local PostgreSQL**
```sql
CREATE DATABASE hospital_db;
```

**Option B — Neon (free cloud PostgreSQL)**

Sign up at [neon.tech](https://neon.tech), create a project, and copy your connection string.

### 3. Configure environment
```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Local PostgreSQL
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/hospital_db

# Neon (cloud) — note: use sslmode=require, not ssl=require
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
```

> ⚠️ **Neon users:** use `sslmode=require` in the URL (not `ssl=require`), and remove `channel_binding=require` — these parameters are not supported by the `pg` package.

### 4. Run migrations
```bash
npm run migrate
```

This creates all tables and seeds:
- 8 departments (Emergency, Cardiology, Neurology, etc.)
- 8 doctors with specializations
- 8 patients with medical profiles
- 8 appointments with varied statuses
- 3 sample medical records

### 5. Start the dev server
```bash
npm run dev
```

Visit **http://localhost:3000** — you'll be redirected to the dashboard automatically.

---

## Database Schema

```
departments      — id, name, description, floor
doctors          — id, first_name, last_name, email, phone, specialization,
                   department_id, license_number, status, avatar_initials
patients         — id, first_name, last_name, email, phone, date_of_birth,
                   gender, blood_type, address, emergency_contact_name,
                   emergency_contact_phone, medical_notes, status
appointments     — id, patient_id, doctor_id, department_id, scheduled_at,
                   duration_min, reason, notes, status
medical_records  — id, patient_id, doctor_id, appointment_id, diagnosis,
                   treatment, prescription, lab_results, follow_up_date
```

### Status enumerations

| Entity       | Statuses                                                                 |
|--------------|--------------------------------------------------------------------------|
| Patient      | `active` · `stable` · `critical` · `discharged`                         |
| Doctor       | `active` · `on_leave` · `inactive`                                       |
| Appointment  | `scheduled` · `confirmed` · `in_progress` · `completed` · `cancelled` · `no_show` |

---

## API Reference

All endpoints return JSON. List endpoints support query parameters for filtering and pagination.

### Patients

| Method   | Endpoint              | Description                              |
|----------|-----------------------|------------------------------------------|
| `GET`    | `/api/patients`       | List patients (search, filter, paginate) |
| `POST`   | `/api/patients`       | Create a new patient                     |
| `GET`    | `/api/patients/[id]`  | Get patient by ID                        |
| `PUT`    | `/api/patients/[id]`  | Update patient                           |
| `DELETE` | `/api/patients/[id]`  | Delete patient                           |

### Doctors

| Method   | Endpoint             | Description                        |
|----------|----------------------|------------------------------------|
| `GET`    | `/api/doctors`       | List doctors (search, filter)      |
| `POST`   | `/api/doctors`       | Create a new doctor                |
| `GET`    | `/api/doctors/[id]`  | Get doctor by ID                   |
| `PUT`    | `/api/doctors/[id]`  | Update doctor                      |
| `DELETE` | `/api/doctors/[id]`  | Delete doctor                      |

### Appointments

| Method   | Endpoint                  | Description                                       |
|----------|---------------------------|---------------------------------------------------|
| `GET`    | `/api/appointments`       | List appointments (search, filter by date/status) |
| `POST`   | `/api/appointments`       | Schedule a new appointment                        |
| `GET`    | `/api/appointments/[id]`  | Get appointment by ID                             |
| `PUT`    | `/api/appointments/[id]`  | Update appointment                                |
| `DELETE` | `/api/appointments/[id]`  | Delete appointment                                |

### Other

| Method | Endpoint           | Description               |
|--------|--------------------|---------------------------|
| `GET`  | `/api/departments` | List all departments      |
| `GET`  | `/api/dashboard`   | Aggregate dashboard stats |

### Query Parameters

**`GET /api/patients`**

| Param    | Type   | Description                                             |
|----------|--------|---------------------------------------------------------|
| `search` | string | Filter by name, email, or phone                         |
| `status` | string | `active` · `stable` · `critical` · `discharged`        |
| `page`   | number | Page number (default: `1`)                              |

**`GET /api/appointments`**

| Param    | Type   | Description                         |
|----------|--------|-------------------------------------|
| `search` | string | Filter by patient or doctor name    |
| `status` | string | Filter by appointment status        |
| `date`   | string | Filter by exact date (`YYYY-MM-DD`) |

---

## Deployment

### Environment variables required in production

```env
DATABASE_URL=postgresql://...
```

### Deploying to Vercel

1. Push to GitHub
2. Import the repo in [vercel.com](https://vercel.com)
3. Add `DATABASE_URL` as an environment variable (use a Neon connection string for a managed cloud database)
4. Deploy — Vercel auto-detects Next.js

> The `migrate.js` script should be run once after initial deployment to initialise the schema. You can run it as a one-time task locally pointing to the production `DATABASE_URL`, or add it as a build/release step.

### Self-hosting

Build and start the production server:

```bash
npm run build
npm start
```

Ensure `DATABASE_URL` is set in your environment before starting.

---

## Extending the System

MediCore HMS is structured to make adding new features straightforward:

- **New resource** — add an `app/api/[resource]/route.ts`, a new feature folder under `app/`, a hook under `hooks/`, and extend `lib/types.ts` with the new types.
- **Authentication** — the API route handlers have no auth layer by default. Add middleware via Next.js `middleware.ts` or wrap route handlers with a session check (e.g. NextAuth, Clerk, or custom JWT verification).
- **Medical records UI** — the `medical_records` table is already seeded and the schema is in place; the UI module can be added as a new feature folder following the same pattern as `patients/` or `appointments/`.
- **Notifications** — appointment status transitions are a natural hook point for email/SMS notifications; extend the `PUT /api/appointments/[id]` handler to trigger outbound messages on status change.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes with descriptive commits
4. Open a pull request with a summary of what changed and why

Please keep new components consistent with the existing feature-folder structure and ensure TypeScript types are updated in `lib/types.ts` for any schema changes.