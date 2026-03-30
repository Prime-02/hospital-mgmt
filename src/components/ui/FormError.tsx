'use client';

// ─── FormError ───────────────────────────────────────────────────────────────
// Displays a red error banner inside a form modal.

interface FormErrorProps {
    message?: string;
}

export function FormError({ message }: FormErrorProps) {
    if (!message) return null;

    return (
        <p className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-xl">
            {message}
        </p>
    );
}