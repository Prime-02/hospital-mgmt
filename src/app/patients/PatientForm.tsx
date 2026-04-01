'use client';
import { Patient } from '@/lib/types';
import { FormError } from '@/components/ui/FormError';

const STATUS_OPTS = ['active', 'stable', 'critical', 'discharged'] as const;
const GENDER_OPTS = ['male', 'female', 'other'] as const;
const BLOOD_OPTS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

interface FieldProps {
    label: string;
    value: string;
    type?: string;
    opts?: readonly string[];
    onChange: (value: string) => void;
}

function Field({ label, value, type = 'text', opts, onChange }: FieldProps) {
    return (
        <div>
            <label className="field-label">{label}</label>
            {opts ? (
                <select
                    className="field-input"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                >
                    <option value="">Select…</option>
                    {opts.map((o) => (
                        <option key={o} value={o}>
                            {o}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    className="field-input"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            )}
        </div>
    );
}

interface PatientFormProps {
    form: Partial<Patient>;
    error: string;
    loading: boolean;
    isEdit: boolean;
    onChange: (form: Partial<Patient>) => void;
    onSubmit: () => void;
    onCancel: () => void;
}

export function PatientForm({
    form,
    error,
    loading,
    isEdit,
    onChange,
    onSubmit,
    onCancel,
}: PatientFormProps) {
    const handleFieldChange = (field: keyof Patient, value: string) => {
        onChange({ ...form, [field]: value || undefined });
    };

    const renderField = (
        key: keyof Patient,
        label: string,
        type = 'text',
        opts?: readonly string[]
    ) => (
        <Field
            key={key}
            label={label}
            value={(form[key] as string) ?? ''}
            type={type}
            opts={opts}
            onChange={(v) => handleFieldChange(key, v)}
        />
    );

    return (
        <div className="space-y-5">
            <FormError message={error} />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {renderField('first_name', 'First Name')}
                {renderField('last_name', 'Last Name')}
                {renderField('email', 'Email', 'email')}
                {renderField('phone', 'Phone', 'tel')}
                {renderField('date_of_birth', 'Date of Birth', 'date')}
                {renderField('gender', 'Gender', 'text', GENDER_OPTS)}
                {renderField('blood_type', 'Blood Type', 'text', BLOOD_OPTS)}
                {renderField('status', 'Status', 'text', STATUS_OPTS)}
            </div>

            <div>
                <label className="field-label">Address</label>
                <input
                    className="field-input"
                    value={form.address ?? ''}
                    onChange={(e) => handleFieldChange('address', e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {renderField('emergency_contact_name', 'Emergency Contact Name')}
                {renderField('emergency_contact_phone', 'Emergency Contact Phone', 'tel')}
            </div>

            <div>
                <label className="field-label">Medical Notes</label>
                <textarea
                    className="field-input resize-none"
                    rows={3}
                    value={form.medical_notes ?? ''}
                    onChange={(e) => handleFieldChange('medical_notes', e.target.value)}
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
                    {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Patient'}
                </button>
            </div>
        </div>
    );
}