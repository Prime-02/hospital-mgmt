'use client';

interface DashboardHeaderProps {
    userName?: string;
}

export function DashboardHeader({ userName = 'Admin' }: DashboardHeaderProps) {
    const today = new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="mb-8">
            <p className="text-slate-500 text-sm mb-0.5">{today}</p>
            <h1
                className="text-3xl font-bold text-slate-800"
                style={{ fontFamily: 'Playfair Display, serif' }}
            >
                Good morning, {userName}
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
                Here&apos;s what&apos;s happening at MediCore today.
            </p>
        </div>
    );
}