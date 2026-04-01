'use client';
import { Doctor } from '@/lib/types';
import { DoctorCard } from './DoctorCard';

interface DoctorGridProps {
    doctors: Doctor[];
    onEdit: (doctor: Doctor) => void;
    onDelete: (id: number) => void;
}

export function DoctorGrid({ doctors, onEdit, onDelete }: DoctorGridProps) {
    if (doctors.length === 0) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <div className="col-span-3 text-center py-20 text-slate-400">
                    No doctors found
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {doctors.map((doctor, idx) => (
                <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    index={idx}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}