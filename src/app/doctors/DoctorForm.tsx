'use client';
import { Department, Doctor } from '@/lib/types';
import { FormError } from '@/components/ui/FormError';

type DoctorStatus = 'active' | 'on_leave' | 'inactive';

const STATUS_OPTS: DoctorStatus[] = ['active', 'on_leave', 'inactive'];

interface DoctorFormProps {
  form: Partial<Doctor>;
  departments: Department[];
  error: string;
  loading: boolean;
  isEdit: boolean;
  onChange: (form: Partial<Doctor>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function DoctorForm({
  form,
  departments,
  error,
  loading,
  isEdit,
  onChange,
  onSubmit,
  onCancel,
}: DoctorFormProps) {
  const handleChange = (field: keyof Doctor, value: any) => {
    onChange({ ...form, [field]: value });
  };

  return (
    <div className="space-y-4">
      <FormError message={error} />

      <div className="grid grid-cols-2 gap-4">
        {(['first_name', 'last_name'] as const).map((k) => (
          <div key={k}>
            <label className="field-label">
              {k === 'first_name' ? 'First Name' : 'Last Name'}
            </label>
            <input
              className="field-input"
              value={(form[k] as string) ?? ''}
              onChange={(e) => handleChange(k, e.target.value)}
            />
          </div>
        ))}

        <div>
          <label className="field-label">Email</label>
          <input
            type="email"
            className="field-input"
            value={form.email ?? ''}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>

        <div>
          <label className="field-label">Phone</label>
          <input
            type="tel"
            className="field-input"
            value={form.phone ?? ''}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </div>

        <div>
          <label className="field-label">Specialization</label>
          <input
            className="field-input"
            value={form.specialization ?? ''}
            onChange={(e) => handleChange('specialization', e.target.value)}
          />
        </div>

        <div>
          <label className="field-label">License Number</label>
          <input
            className="field-input font-mono"
            value={form.license_number ?? ''}
            onChange={(e) => handleChange('license_number', e.target.value)}
          />
        </div>

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

        <div>
          <label className="field-label">Status</label>
          <select
            className="field-input"
            value={form.status ?? 'active'}
            onChange={(e) => handleChange('status', e.target.value as DoctorStatus)}
          >
            {STATUS_OPTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
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
          {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Doctor'}
        </button>
      </div>
    </div>
  );
}