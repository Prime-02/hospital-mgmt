'use client';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: number;
    icon: LucideIcon;
    light: string;
    text: string;
    trend: string;
}

export function StatCard({ label, value, icon: Icon, light, text, trend }: StatCardProps) {
    return (
        <div className="card p-5 flex items-start gap-4 hover:shadow-card-hover transition-shadow">
            <div className={`${light} p-3 rounded-xl flex-shrink-0`}>
                <Icon size={22} className={text} />
            </div>
            <div className="min-w-0">
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">
                    {label}
                </p>
                <p className="stat-number text-3xl font-bold text-slate-800">{value}</p>
                <p className={`text-xs ${text} mt-1 font-medium`}>{trend}</p>
            </div>
        </div>
    );
}