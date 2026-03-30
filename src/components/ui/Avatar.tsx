'use client';

const GRADIENTS = [
    'from-teal-400 to-teal-600',
    'from-blue-400 to-blue-600',
    'from-violet-400 to-violet-600',
    'from-emerald-400 to-emerald-600',
    'from-amber-400 to-amber-600',
    'from-rose-400 to-rose-600',
] as const;

type Size = 'sm' | 'md' | 'lg';

const SIZE_CLASSES: Record<Size, string> = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-8 h-8 text-xs',
    lg: 'w-12 h-12 text-sm',
};

interface AvatarProps {
    initials: string;
    colorIndex?: number;
    size?: Size;
    colorClass?: string;
}

export function Avatar({
    initials,
    colorIndex = 0,
    size = 'md',
    colorClass,
}: AvatarProps) {
    const gradient = colorClass
        ? colorClass
        : `bg-gradient-to-br ${GRADIENTS[colorIndex % GRADIENTS.length]}`;

    return (
        <div
            className={`${SIZE_CLASSES[size]} ${gradient} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}
        >
            {initials.slice(0, 2).toUpperCase()}
        </div>
    );
}

/** Derive initials from a full name string, e.g. "Jane Doe" → "JD". */
export function initialsFromName(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0] ?? '')
        .join('')
        .slice(0, 2)
        .toUpperCase();
}