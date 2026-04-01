'use client';
import { AptStatus } from '@/lib/types';
import { Search } from 'lucide-react';

const STATUS_OPTS: AptStatus[] = [
    'scheduled',
    'confirmed',
    'in_progress',
    'completed',
    'cancelled',
    'no_show',
];

interface FilterBarProps {
    searchInput: string;
    statusFilter: string;
    dateFilter: string;
    onSearchChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onDateChange: (value: string) => void;
    onClear: () => void;
}

export function FilterBar({
    searchInput,
    statusFilter,
    dateFilter,
    onSearchChange,
    onStatusChange,
    onDateChange,
    onClear,
}: FilterBarProps) {
    const hasFilters = searchInput || statusFilter || dateFilter;

    return (
        <div className="flex gap-3 mb-6 flex-wrap w-full">
            <div className="relative flex-1 min-w-[200px]">
                <Search
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search patient or doctor…"
                    value={searchInput}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <select
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white sm:w-44"
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value)}
            >
                <option value="">All statuses</option>
                {STATUS_OPTS.map((s) => (
                    <option key={s} value={s}>
                        {s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                ))}
            </select>

            <input
                type="date"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:w-44"
                value={dateFilter}
                onChange={(e) => onDateChange(e.target.value)}
            />

            {hasFilters && (
                <button
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    onClick={onClear}
                >
                    Clear
                </button>
            )}
        </div>
    );
}