'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PatientPaginationProps {
    page: number;
    totalPages: number;
    total: number;
    search: string;
    status: string;
}

export function PatientPagination({
    page,
    totalPages,
    total,
    search,
    status,
}: PatientPaginationProps) {
    const router = useRouter();

    if (totalPages <= 1) return null;

    const handlePageChange = (newPage: number) => {
        router.push(`/patients?search=${search}&status=${status}&page=${newPage}`);
    };

    return (
        <div className="flex items-center justify-between mt-5">
            <p className="text-sm text-slate-500">
                Page {page} of {totalPages} · {total} patients
            </p>
            <div className="flex gap-2">
                <button
                    disabled={page <= 1}
                    onClick={() => handlePageChange(page - 1)}
                    className="btn-secondary py-2 px-3 disabled:opacity-40"
                >
                    <ChevronLeft size={16} />
                </button>
                <button
                    disabled={page >= totalPages}
                    onClick={() => handlePageChange(page + 1)}
                    className="btn-secondary py-2 px-3 disabled:opacity-40"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}