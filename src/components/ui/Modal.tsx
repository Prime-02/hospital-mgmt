'use client';
import { ReactNode } from 'react';
import { X } from 'lucide-react';


interface ModalProps {
    open: boolean;
    onClose: () => void;
    icon?: ReactNode;
    title: string;
    children: ReactNode;
    maxWidth?: string;
}

export function Modal({
    open,
    onClose,
    icon,
    title,
    children,
    maxWidth = 'max-w-lg',
}: ModalProps) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto animate-slide-up`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
                    <div className="flex items-center gap-2">
                        {icon}
                        <h2
                            className="font-bold text-slate-800"
                            style={{ fontFamily: 'Playfair Display, serif' }}
                        >
                            {title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-slate-100 rounded-lg"
                        aria-label="Close modal"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}