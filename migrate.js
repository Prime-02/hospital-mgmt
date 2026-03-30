const { Pool } = require('pg');

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL,
});

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('🏥 Running hospital database migrations...\n');
    await client.query('BEGIN');

    // ─── Departments ────────────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        floor       INTEGER,
        created_at  TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✅  departments table ready');

    // ─── Doctors ────────────────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS doctors (
        id              SERIAL PRIMARY KEY,
        first_name      VARCHAR(50)  NOT NULL,
        last_name       VARCHAR(50)  NOT NULL,
        email           VARCHAR(150) NOT NULL UNIQUE,
        phone           VARCHAR(20),
        specialization  VARCHAR(100) NOT NULL,
        department_id   INTEGER REFERENCES departments(id) ON DELETE SET NULL,
        license_number  VARCHAR(50)  NOT NULL UNIQUE,
        status          VARCHAR(20)  NOT NULL DEFAULT 'active'
                          CHECK (status IN ('active', 'on_leave', 'inactive')),
        avatar_initials VARCHAR(4),
        created_at      TIMESTAMPTZ DEFAULT NOW(),
        updated_at      TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✅  doctors table ready');

    // ─── Patients ───────────────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id              SERIAL PRIMARY KEY,
        first_name      VARCHAR(50)  NOT NULL,
        last_name       VARCHAR(50)  NOT NULL,
        email           VARCHAR(150) UNIQUE,
        phone           VARCHAR(20),
        date_of_birth   DATE,
        gender          VARCHAR(10)  CHECK (gender IN ('male', 'female', 'other')),
        blood_type      VARCHAR(5)   CHECK (blood_type IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
        address         TEXT,
        emergency_contact_name  VARCHAR(100),
        emergency_contact_phone VARCHAR(20),
        medical_notes   TEXT,
        status          VARCHAR(20)  NOT NULL DEFAULT 'active'
                          CHECK (status IN ('active', 'discharged', 'critical', 'stable')),
        created_at      TIMESTAMPTZ DEFAULT NOW(),
        updated_at      TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✅  patients table ready');

    // ─── Appointments ───────────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id              SERIAL PRIMARY KEY,
        patient_id      INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
        doctor_id       INTEGER NOT NULL REFERENCES doctors(id)  ON DELETE CASCADE,
        department_id   INTEGER REFERENCES departments(id)       ON DELETE SET NULL,
        scheduled_at    TIMESTAMPTZ NOT NULL,
        duration_min    INTEGER NOT NULL DEFAULT 30,
        reason          TEXT,
        notes           TEXT,
        status          VARCHAR(20) NOT NULL DEFAULT 'scheduled'
                          CHECK (status IN ('scheduled','confirmed','in_progress','completed','cancelled','no_show')),
        created_at      TIMESTAMPTZ DEFAULT NOW(),
        updated_at      TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✅  appointments table ready');

    // ─── Medical Records ─────────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS medical_records (
        id              SERIAL PRIMARY KEY,
        patient_id      INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
        doctor_id       INTEGER NOT NULL REFERENCES doctors(id)  ON DELETE CASCADE,
        appointment_id  INTEGER REFERENCES appointments(id)      ON DELETE SET NULL,
        diagnosis       TEXT,
        treatment       TEXT,
        prescription    TEXT,
        lab_results     TEXT,
        follow_up_date  DATE,
        created_at      TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✅  medical_records table ready');

    // ─── Indexes ────────────────────────────────────────────────────────────────
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_appointments_patient   ON appointments(patient_id);
      CREATE INDEX IF NOT EXISTS idx_appointments_doctor    ON appointments(doctor_id);
      CREATE INDEX IF NOT EXISTS idx_appointments_scheduled ON appointments(scheduled_at);
      CREATE INDEX IF NOT EXISTS idx_medical_records_patient ON medical_records(patient_id);
    `);
    console.log('✅  indexes ready');

    // ─── Seed Data ───────────────────────────────────────────────────────────────
    const { rows: existing } = await client.query('SELECT COUNT(*) FROM departments');
    if (parseInt(existing[0].count) === 0) {
      console.log('\n🌱 Seeding initial data...');

      await client.query(`
        INSERT INTO departments (name, description, floor) VALUES
          ('Emergency',        'Emergency and trauma care',             1),
          ('Cardiology',       'Heart and cardiovascular diseases',     3),
          ('Neurology',        'Nervous system disorders',              4),
          ('Pediatrics',       'Medical care for children',             2),
          ('Orthopedics',      'Bone and musculoskeletal conditions',   3),
          ('Oncology',         'Cancer diagnosis and treatment',        5),
          ('Radiology',        'Medical imaging and diagnostics',       1),
          ('General Surgery',  'Surgical procedures and operations',    2)
        ON CONFLICT DO NOTHING;
      `);
      console.log('  ✔ departments seeded');

      await client.query(`
        INSERT INTO doctors (first_name, last_name, email, phone, specialization, department_id, license_number, status, avatar_initials) VALUES
          ('Amara',   'Okonkwo',  'a.okonkwo@hospital.com',  '+234-801-0001', 'Emergency Medicine',    1, 'MD-001', 'active',   'AO'),
          ('James',   'Adeyemi',  'j.adeyemi@hospital.com',  '+234-801-0002', 'Cardiology',            2, 'MD-002', 'active',   'JA'),
          ('Chioma',  'Eze',      'c.eze@hospital.com',      '+234-801-0003', 'Neurology',             3, 'MD-003', 'active',   'CE'),
          ('David',   'Nwosu',    'd.nwosu@hospital.com',    '+234-801-0004', 'Pediatrics',            4, 'MD-004', 'active',   'DN'),
          ('Fatima',  'Bello',    'f.bello@hospital.com',    '+234-801-0005', 'Orthopedic Surgery',    5, 'MD-005', 'on_leave', 'FB'),
          ('Samuel',  'Taiwo',    's.taiwo@hospital.com',    '+234-801-0006', 'Oncology',              6, 'MD-006', 'active',   'ST'),
          ('Grace',   'Mensah',   'g.mensah@hospital.com',   '+234-801-0007', 'Radiology',             7, 'MD-007', 'active',   'GM'),
          ('Ibrahim', 'Musa',     'i.musa@hospital.com',     '+234-801-0008', 'General Surgery',       8, 'MD-008', 'active',   'IM')
        ON CONFLICT DO NOTHING;
      `);
      console.log('  ✔ doctors seeded');

      await client.query(`
        INSERT INTO patients (first_name, last_name, email, phone, date_of_birth, gender, blood_type, address, status, medical_notes) VALUES
          ('Emeka',   'Obi',       'emeka.obi@email.com',    '+234-803-1001', '1985-03-15', 'male',   'O+',  '12 Awolowo Road, Lagos',     'stable',    'Hypertension, taking medication'),
          ('Ngozi',   'Chukwu',    'ngozi.c@email.com',      '+234-803-1002', '1990-07-22', 'female', 'A+',  '45 Adeola Street, Ibadan',   'active',    'No known allergies'),
          ('Tunde',   'Afolabi',   'tunde.a@email.com',      '+234-803-1003', '1978-11-08', 'male',   'B-',  '7 Kingsway Avenue, Abuja',   'critical',  'Diabetic, requires insulin'),
          ('Bisi',    'Fadahunsi', 'bisi.f@email.com',       '+234-803-1004', '2001-05-30', 'female', 'AB+', '23 University Road, Ibadan', 'active',    NULL),
          ('Chidi',   'Okeke',     'chidi.o@email.com',      '+234-803-1005', '1965-09-12', 'male',   'O-',  '88 Trans-Amadi, Port Harcourt','stable',  'Previous cardiac event in 2022'),
          ('Aisha',   'Garba',     'aisha.g@email.com',      '+234-803-1006', '1995-01-18', 'female', 'A-',  '15 Kano Road, Kano',         'active',    'Asthma'),
          ('Olu',     'Williams',  'olu.w@email.com',        '+234-803-1007', '2015-06-03', 'male',   'B+',  '4 Lekki Phase 1, Lagos',     'active',    'Childhood immunizations up to date'),
          ('Halima',  'Sule',      'halima.s@email.com',     '+234-803-1008', '1972-12-20', 'female', 'O+',  '67 Zaria Road, Kaduna',      'discharged','Post-surgery recovery')
        ON CONFLICT DO NOTHING;
      `);
      console.log('  ✔ patients seeded');

      await client.query(`
        INSERT INTO appointments (patient_id, doctor_id, department_id, scheduled_at, duration_min, reason, status) VALUES
          (1, 2, 2, NOW() + INTERVAL '1 day',    30, 'Routine cardiac check-up',          'confirmed'),
          (2, 4, 4, NOW() + INTERVAL '2 hours',  20, 'General wellness consultation',      'in_progress'),
          (3, 1, 1, NOW() - INTERVAL '2 hours',  45, 'Emergency blood sugar management',   'completed'),
          (4, 3, 3, NOW() + INTERVAL '3 days',   30, 'Migraine evaluation',               'scheduled'),
          (5, 2, 2, NOW() + INTERVAL '5 hours',  45, 'Post-cardiac event follow-up',      'confirmed'),
          (6, 1, 1, NOW() - INTERVAL '1 day',    30, 'Asthma attack treatment',           'completed'),
          (7, 4, 4, NOW() + INTERVAL '2 days',   20, 'Vaccination schedule',              'scheduled'),
          (8, 8, 8, NOW() + INTERVAL '4 days',   60, 'Post-surgery assessment',           'scheduled')
        ON CONFLICT DO NOTHING;
      `);
      console.log('  ✔ appointments seeded');

      await client.query(`
        INSERT INTO medical_records (patient_id, doctor_id, appointment_id, diagnosis, treatment, prescription) VALUES
          (3, 1, 3, 'Hyperglycemia episode', 'IV fluids, insulin drip administered', 'Metformin 500mg twice daily, dietary review'),
          (6, 1, 6, 'Acute asthma exacerbation', 'Nebulization treatment, oxygen therapy', 'Salbutamol inhaler, prednisolone 5 days'),
          (5, 2, NULL, 'Stable angina post-MI', 'Lifestyle counselling, medication review', 'Aspirin 75mg, Atorvastatin 20mg daily')
        ON CONFLICT DO NOTHING;
      `);
      console.log('  ✔ medical records seeded');
    }

    await client.query('COMMIT');
    console.log('\n🎉 All migrations completed successfully!\n');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
