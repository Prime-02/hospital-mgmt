export interface Department {
  id: number;
  name: string;
  description?: string;
  floor?: number;
  created_at: string;
}

export interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  specialization: string;
  department_id?: number;
  department_name?: string;
  license_number: string;
  status: 'active' | 'on_leave' | 'inactive';
  avatar_initials?: string;
  created_at: string;
  updated_at: string;
}

export interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  blood_type?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_notes?: string;
  status: 'active' | 'discharged' | 'critical' | 'stable';
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  department_id?: number;
  scheduled_at: string;
  duration_min: number;
  reason?: string;
  notes?: string;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  patient_name?: string;
  doctor_name?: string;
  department_name?: string;
  created_at: string;
  updated_at: string;
}

export interface MedicalRecord {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_id?: number;
  diagnosis?: string;
  treatment?: string;
  prescription?: string;
  lab_results?: string;
  follow_up_date?: string;
  created_at: string;
  patient_name?: string;
  doctor_name?: string;
}

export interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  todayAppointments: number;
  criticalPatients: number;
  completedToday: number;
  pendingAppointments: number;
}
