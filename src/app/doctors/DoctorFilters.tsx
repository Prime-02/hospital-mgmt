'use client';
import { Search } from 'lucide-react';

interface DoctorFiltersProps {
    search: string;
    status: string;
    onSearch: (value: string) => void;
    onStatusChange: (value: string) => void;
}

const STATUS_OPTS = ['active', 'on_leave', 'inactive'];

export function DoctorFilters({ search, status, onSearch, onStatusChange }: DoctorFiltersProps) {
    return (
        <div className="flex gap-3 mb-6 items-center">
            <div className="relative flex-1">
                <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search doctors…"
                    defaultValue={search}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter')
                            onSearch((e.target as HTMLInputElement).value);
                    }}
                />
            </div>
            <select
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                value={status}
                onChange={(e) => onStatusChange(e.target.value)}
            >
                <option value="">All statuses</option>
                {STATUS_OPTS.map((s) => (
                    <option key={s} value={s}>
                        {s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                ))}
            </select>
        </div>
    );
}