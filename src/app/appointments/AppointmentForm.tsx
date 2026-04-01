'use client';
import { Calendar } from 'lucide-react';
import { Appointment, AptStatus, Department, Doctor, Patient } from '@/lib/types';
import { FormError } from '@/components/ui/FormError';

const STATUS_OPTS: AptStatus[] = [
    'scheduled',
    'confirmed',
    'in_progress',
    'completed',
    'cancelled',
    'no_show',
];

interface AppointmentFormProps {
    form: Partial<Appointment>;
    patients: Partial<Patient>[];
    doctors: Partial<Doctor>[];
    departments: Department[];
    error: string;
    loading: boolean;
    isEdit: boolean;
    onChange: (form: Partial<Appointment>) => void;
    onSubmit: () => void;
    onCancel: () => void;
}

export function AppointmentForm({
    form,
    patients,
    doctors,
    departments,
    error,
    loading,
    isEdit,
    onChange,
    onSubmit,
    onCancel,
}: AppointmentFormProps) {
    const handleChange = (field: keyof Appointment, value: any) => {
        onChange({ ...form, [field]: value });
    };

    return (
        <div className="space-y-4">
            <FormError message={error} />

            {/* Patient */}
            <div>
                <label className="field-label">Patient</label>
                <select
                    className="field-input"
                    value={form.patient_id ?? ''}
                    onChange={(e) => handleChange('patient_id', parseInt(e.target.value))}
                >
                    <option value="">Select patient…</option>
                    {patients.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.first_name} {p.last_name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Doctor */}
            <div>
                <label className="field-label">Doctor</label>
                <select
                    className="field-input"
                    value={form.doctor_id ?? ''}
                    onChange={(e) => handleChange('doctor_id', parseInt(e.target.value))}
                >
                    <option value="">Select doctor…</option>
                    {doctors.map((d) => (
                        <option key={d.id} value={d.id}>
                            Dr. {d.first_name} {d.last_name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Department */}
            <div>
                <label className="field-label">Department</label>
                <select
                    className="field-input"
                    value={form.department_id ?? ''}
                    onChange={(e) =>
                        handleChange(
                            'department_id',
                            e.target.value ? parseInt(e.target.value) : undefined
                        )
                    }
                >
                    <option value="">None</option>
                    {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                            {d.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Date/Time + Duration */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className="field-label">Date &amp; Time</label>
                    <input
                        type="datetime-local"
                        className="field-input"
                        value={form.scheduled_at ?? ''}
                        onChange={(e) => handleChange('scheduled_at', e.target.value)}
                    />
                </div>
                <div>
                    <label className="field-label">Duration (minutes)</label>
                    <input
                        type="number"
                        min={10}
                        max={240}
                        className="field-input"
                        value={form.duration_min ?? 30}
                        onChange={(e) => handleChange('duration_min', parseInt(e.target.value))}
                    />
                </div>
            </div>

            {/* Status */}
            <div>
                <label className="field-label">Status</label>
                <select
                    className="field-input"
                    value={form.status ?? 'scheduled'}
                    onChange={(e) => handleChange('status', e.target.value)}
                >
                    {STATUS_OPTS.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            </div>

            {/* Reason */}
            <div>
                <label className="field-label">Reason for Visit</label>
                <input
                    className="field-input"
                    value={form.reason ?? ''}
                    onChange={(e) => handleChange('reason', e.target.value)}
                />
            </div>

            {/* Notes */}
            <div>
                <label className="field-label">Notes</label>
                <textarea
                    className="field-input resize-none"
                    rows={2}
                    value={form.notes ?? ''}
                    onChange={(e) => handleChange('notes', e.target.value)}
                />
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <button onClick={onCancel} className="btn-secondary">
                    Cancel
                </button>
                <button
                    onClick={onSubmit}
                    disabled={loading}
                    className="btn-primary disabled:opacity-60"
                >
                    {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Schedule'}
                </button>
            </div>
        </div>
    );
}