# MediCore HMS — Hospital Management System

A full-featured hospital management system built with **Next.js 15**, **PostgreSQL** (`pg`), and **Tailwind CSS**.

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Framework  | Next.js 15 (App Router, src dir)  |
| Database   | PostgreSQL via `pg` package       |
| Styling    | Tailwind CSS + custom design      |
| Language   | TypeScript                        |
| Fonts      | Playfair Display + Source Sans 3  |

---

## Features

- **Dashboard** — live stats, recent appointments, patient watch list
- **Patients** — full CRUD, search/filter, pagination, status management
- **Doctors** — card-based UI, full CRUD, department assignment
- **Appointments** — schedule, quick-status update, filter by date/status/name
- **Database** — `migrate.js` handles schema creation + seed data in one command

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up PostgreSQL

Create a database:
```sql
CREATE DATABASE hospital_db;
```

### 3. Configure environment
```bash
cp .env.example .env.local
# Edit .env.local with your DATABASE_URL
```

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/hospital_db
```

### 4. Run migrations
```bash
npm run migrate
```
This creates all tables and seeds 8 departments, 8 doctors, 8 patients, and sample appointments.

### 5. Start the dev server
```bash
npm run dev
```

Visit **http://localhost:3000**

---

## Database Schema

```
departments        — id, name, description, floor
doctors            — id, name, email, specialization, department_id, license_number, status
patients           — id, name, email, phone, dob, gender, blood_type, status, medical_notes
appointments       — id, patient_id, doctor_id, department_id, scheduled_at, duration, status
medical_records    — id, patient_id, doctor_id, appointment_id, diagnosis, treatment, prescription
```

## API Routes

| Method | Endpoint                   | Description              |
|--------|----------------------------|--------------------------|
| GET    | `/api/patients`            | List patients (paginated)|
| POST   | `/api/patients`            | Create patient           |
| GET    | `/api/patients/[id]`       | Get patient by ID        |
| PUT    | `/api/patients/[id]`       | Update patient           |
| DELETE | `/api/patients/[id]`       | Delete patient           |
| GET    | `/api/doctors`             | List doctors             |
| POST   | `/api/doctors`             | Create doctor            |
| PUT    | `/api/doctors/[id]`        | Update doctor            |
| DELETE | `/api/doctors/[id]`        | Delete doctor            |
| GET    | `/api/appointments`        | List appointments        |
| POST   | `/api/appointments`        | Create appointment       |
| PUT    | `/api/appointments/[id]`   | Update appointment       |
| DELETE | `/api/appointments/[id]`   | Delete appointment       |
| GET    | `/api/departments`         | List departments         |
| GET    | `/api/dashboard`           | Dashboard statistics     |
