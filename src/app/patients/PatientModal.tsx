'use client';
import { User } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { PatientForm } from './PatientForm';
import { Patient } from '@/lib/types';

interface PatientModalProps {
    isOpen: boolean;
    mode: 'add' | 'edit';
    form: Partial<Patient>;
    error: string;
    loading: boolean;
    onClose: () => void;
    onChange: (form: Partial<Patient>) => void;
    onSubmit: () => void;
}

export function PatientModal({
    isOpen,
    mode,
    form,
    error,
    loading,
    onClose,
    onChange,
    onSubmit,
}: PatientModalProps) {
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            icon={<User size={18} className="text-teal-500" />}
            title={mode === 'add' ? 'Add New Patient' : 'Edit Patient'}
            maxWidth="max-w-2xl"
        >
            <PatientForm
                form={form}
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