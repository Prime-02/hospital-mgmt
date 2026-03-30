# MediCore HMS — Hospital Management System

A full-featured hospital management system built with **Next.js 15**, **PostgreSQL** (`pg`), and **Tailwind CSS**.

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

---

## Features

- **Dashboard** — live stats (active patients, doctors, today's appointments, critical cases), recent appointments feed, patient watch list
- **Patients** — full CRUD, search/filter by name/email/phone, status filter, pagination, blood type & gender tracking
- **Doctors** — card-grid UI, full CRUD, department assignment, license number management
- **Appointments** — schedule, edit, delete, quick inline status updates, filter by date/status/name
- **Database** — `migrate.js` handles schema creation + seed data in one command
- **REST API** — full JSON API for all resources, ready for external integrations

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── appointments/[id]/route.ts
│   │   ├── appointments/route.ts
│   │   ├── dashboard/route.ts
│   │   ├── departments/route.ts
│   │   ├── doctors/[id]/route.ts
│   │   ├── doctors/route.ts
│   │   ├── patients/[id]/route.ts
│   │   └── patients/route.ts
│   ├── appointments/
│   │   ├── AppointmentForm.tsx
│   │   ├── AppointmentModal.tsx
│   │   ├── AppointmentsClient.tsx
│   │   ├── AppointmentTable.tsx
│   │   ├── FilterBar.tsx
│   │   └── page.tsx
│   ├── dashboard/
│   │   ├── DashboardClient.tsx
│   │   ├── DashboardContent.tsx
│   │   ├── DashboardHeader.tsx
│   │   ├── PatientWatch.tsx
│   │   ├── RecentAppointments.tsx
│   │   ├── StatCard.tsx
│   │   └── StatGrid.tsx
│   ├── doctors/
│   │   ├── DoctorCard.tsx
│   │   ├── DoctorFilters.tsx
│   │   ├── DoctorForm.tsx
│   │   ├── DoctorGrid.tsx
│   │   ├── DoctorModal.tsx
│   │   ├── DoctorsClient.tsx
│   │   └── page.tsx
│   ├── patients/
│   │   ├── page.tsx
│   │   ├── PatientFilters.tsx
│   │   ├── PatientForm.tsx
│   │   ├── PatientModal.tsx
│   │   ├── PatientPagination.tsx
│   │   ├── PatientsClient.tsx
│   │   ├── PatientTable.tsx
│   │   └── PatientTableRow.tsx
│   ├── error.tsx
│   ├── global-error.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/
│   │   └── Sidebar.tsx
│   └── ui/
│       ├── Avatar.tsx
│       ├── DeleteConfirmDialog.tsx
│       ├── FormError.tsx
│       ├── index.ts
│       ├── Modal.tsx
│       ├── PageHeader.tsx
│       └── StatusBadge.tsx
├── hooks/
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
    ├── api.ts
    ├── db.ts
    ├── format.ts
    ├── index.ts
    └── types.ts
```

---

## Quick Start

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

Visit **http://localhost:3000**

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

### Patient statuses
`active` · `stable` · `critical` · `discharged`

### Doctor statuses
`active` · `on_leave` · `inactive`

### Appointment statuses
`scheduled` · `confirmed` · `in_progress` · `completed` · `cancelled` · `no_show`

---

## API Routes

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
| Method   | Endpoint                  | Description                                    |
|----------|---------------------------|------------------------------------------------|
| `GET`    | `/api/appointments`       | List appointments (search, filter by date/status) |
| `POST`   | `/api/appointments`       | Schedule a new appointment                     |
| `GET`    | `/api/appointments/[id]`  | Get appointment by ID                          |
| `PUT`    | `/api/appointments/[id]`  | Update appointment                             |
| `DELETE` | `/api/appointments/[id]`  | Delete appointment                             |

### Other
| Method | Endpoint           | Description               |
|--------|--------------------|---------------------------|
| `GET`  | `/api/departments` | List all departments      |
| `GET`  | `/api/dashboard`   | Aggregate dashboard stats |

---

## Query Parameters

**`GET /api/patients`**
| Param    | Type   | Description                         |
|----------|--------|-------------------------------------|
| `search` | string | Filter by name, email, or phone     |
| `status` | string | `active` · `stable` · `critical` · `discharged` |
| `page`   | number | Page number (default: `1`)          |

**`GET /api/appointments`**
| Param    | Type   | Description                         |
|----------|--------|-------------------------------------|
| `search` | string | Filter by patient or doctor name    |
| `status` | string | Filter by appointment status        |
| `date`   | string | Filter by exact date (`YYYY-MM-DD`) |

---

## Adding Screenshots

Place your screenshots in `public/hms-screenshots/` using these exact filenames so the README images resolve correctly:

```
public/
└── hms-screenshots/
    ├── dashboard.png
    ├── patients-list.png
    ├── patients-add.png
    ├── patients-edit.png
    ├── patients-delete.png
    ├── doctors-grid.png
    ├── doctors-add.png
    ├── doctors-edit.png
    ├── appointments-list.png
    ├── appointments-add.png
    ├── appointments-edit.png
    └── appointments-status.png
```

---

## License

MIT