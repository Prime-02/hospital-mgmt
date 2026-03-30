'use client';
import { Stethoscope } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { DoctorForm } from './DoctorForm';
import { Department, Doctor } from '@/lib/types';

interface DoctorModalProps {
    isOpen: boolean;
    mode: 'add' | 'edit';
    form: Partial<Doctor>;
    departments: Department[];
    error: string;
    loading: boolean;
    onClose: () => void;
    onChange: (form: Partial<Doctor>) => void;
    onSubmit: () => void;
}

export function DoctorModal({
    isOpen,
    mode,
    form,
    departments,
    error,
    loading,
    onClose,
    onChange,
    onSubmit,
}: DoctorModalProps) {
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            icon={<Stethoscope size={18} className="text-teal-500" />}
            title={mode === 'add' ? 'Add New Doctor' : 'Edit Doctor'}
            maxWidth="max-w-xl"
        >
            <DoctorForm
                form={form}
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