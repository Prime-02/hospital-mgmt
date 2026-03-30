'use client';
import { Calendar } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { AppointmentForm } from './AppointmentForm';
import { Appointment, Department, Doctor, ModalMode, Patient } from '@/lib/types';


interface AppointmentModalProps {
    isOpen: boolean;
    mode: ModalMode;
    form: Partial<Appointment>;
    patients: Partial<Patient>[];
    doctors: Partial<Doctor>[];
    departments: Department[];
    error: string;
    loading: boolean;
    onClose: () => void;
    onChange: (form: Partial<Appointment>) => void;
    onSubmit: () => void;
}

export function AppointmentModal({
    isOpen,
    mode,
    form,
    patients,
    doctors,
    departments,
    error,
    loading,
    onClose,
    onChange,
    onSubmit,
}: AppointmentModalProps) {
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            icon={<Calendar size={18} className="text-teal-500" />}
            title={mode === 'add' ? 'Schedule Appointment' : 'Edit Appointment'}
        >
            <AppointmentForm
                form={form}
                patients={patients}
                doctors={doctors}
                departments={departments}
                error={error}
                loading={loading}
                isEdit={mode === 'edit'}
                onChange={onChange}
                onSubmit={onSubmit}
                onCancel={onClose}
            />
        </Modal>
    );
}