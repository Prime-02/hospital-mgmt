'use client';
import { Patient } from '@/lib/types';
import { PatientTableRow } from './PatientTableRow';

interface PatientTableProps {
    patients: Patient[];
    onEdit: (patient: Patient) => void;
    onDelete: (id: number) => void;
}

export function PatientTable({ patients, onEdit, onDelete }: PatientTableProps) {
    if (patients.length === 0) {
        return (
            <div className="card overflow-hidden">
                <div className="text-center py-14 text-slate-400">
                    No patients found
                </div>
            </div>
        );
    }

    return (
        <div className="card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="data-table min-w-[640px]">
                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Contact</th>
                            <th>DOB / Gender</th>
                            <th>Blood</th>
                            <th>Status</th>
                            <th>Notes</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((patient) => (
                            <PatientTableRow
                                key={patient.id}
                                patient={patient}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}